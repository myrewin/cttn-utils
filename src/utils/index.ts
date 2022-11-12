import { access, unlink, constants, mkdir, writeFile } from "fs";

import { Request, Response, NextFunction } from "express";

import { Sequelize } from "sequelize";

import multer from "multer";

import Slugify from "slugify";

import Axios, { AxiosResponse } from "axios";

import jwt from "jsonwebtoken";

import { v1 as uuidV1, validate as UUIDValidaton } from "uuid";

import request from "request";

import { errorMessage, ValidationError } from "../errors/index.js";

export const fileExists = (file: any) => {
  return new Promise((resolve, reject) => {
    access(file, constants.F_OK, (err) => {
      if (err) resolve(false);
      resolve(true);
    });
  });
};

export const base64ToFile = (base64String: any, path: any) => {
  return new Promise((ful, rej) => {
    let file = base64String.replace(/^data:image\/\w+;base64,/, "");
    let format = file.charAt(0);
    if (format === "/") format = "jpg";
    else if (format === "i") format = "png";
    else if (format === "R") format = "gif";
    else if (format === "U") format = "webp";
    else if (format === "J") format = "pdf";
    else if (format === "U") format = "docx";

    createPath(path)
      .then(() => {
        path = `${path}/${uniqueString()}.${format}`;
        writeFile(path, file, "base64", (err) => {
          if (err) rej(err);
          ful(path);
        });
      })
      .catch((err) => rej(err));
  });
};

export const shuffelWord = (word: any) => {
  let shuffledWord = "";
  word = word.split("");
  while (word.length > 0) {
    shuffledWord += word.splice((word.length * Math.random()) << 0, 1);
  }
  return shuffledWord;
};

export const deleteFile = async (file: any): Promise<boolean> => {
  if (await fileExists(file)) {
    return new Promise((resolve, reject) => {
      unlink(file, (err) => {
        return err ? reject(err) : resolve(true);
      });
    });
  }
  return false;
};

const validate = (
  schema: any,
  object: any,
  option = { abortEarly: true, allowUnknown: false }
) => {
  const check = schema.validate(object, option);
  if (check.error) {
    throw new ValidationError(check.error.details[0].message);
  }
  return check.value;
};

export function joiValidator(constraint: any, isMiddleware = true): any {
  if (!constraint)
    throw new ValidationError(
      "Kindly supply validation schema to joiValidator"
    );

  if (!isMiddleware) {
    return validate(constraint.schema, constraint.data, constraint.option);
  }
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (constraint.body) {
        req.body = validate(
          constraint.body.schema,
          req.body,
          constraint.body.options
        );
      }
      if (constraint.params)
        req.params = validate(
          constraint.params.schema,
          req.params,
          constraint.params.options
        );
      if (constraint.query)
        req.query = validate(
          constraint.query.schema,
          req.query,
          constraint.query.options
        );
      if (constraint.headers)
        req.headers = validate(
          constraint.headers.schema,
          req.headers,
          constraint.headers.options
        );

      return next();
    } catch (err) {
      next(err);
    }
  };
}

export const randomString = (N = 10) => {
  return Array(N + 1)
    .join((Math.random().toString(36) + "00000000000000000").slice(2, 18))
    .slice(0, N);
};

export const uniqueString = (capitalize = false): string => {
  const now = Array.from(Date.now().toString());
  let result = "";
  for (let i = 0; i < now.length; i++) {
    if (i % 4 === 0) result += randomString(2);
    result += now[i];
  }
  return capitalize ? result.toUpperCase() : result;
};

export const createPath = (path: any) =>
  new Promise((ful, rej) => {
    fileExists(path)
      .then((exists) => {
        if (exists) return ful(true);
        mkdir(path, { recursive: true }, (err) => {
          if (err) return rej(err);
          return ful(true);
        });
      })
      .catch((err) => rej(err));
  });

export const uploadFile = ({
  name = undefined,
  limit = 5,
  allowedFormat = ["jpg", "jpeg", "png", "gif"],
  location = "/",
}: {
  name?: string;
  limit?: number;
  allowedFormat?: any[];
  location?: string;
}): any => {
  /* Set storage to s3 */
  const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
      await createPath(location);
      cb(null, location);
    },
    filename: (req, file, cb) => {
      let mimetype = file.mimetype.split("/")[1];
      cb(null, name ? name + "." + mimetype : `${uniqueString()}.${mimetype}`);
    },
  });

  /* Limit is converted to bytes from megabyte */
  const limits = { fileSize: limit * 1000000 };

  /* Restrict file format to allowed ones */
  const fileFilter = (req: any, file: any, cb: any) => {
    if (allowedFormat.length === 0) return cb(null, true);
    if (
      allowedFormat.includes(file.originalname.split(".").pop().toLowerCase())
    ) {
      return cb(null, true);
    } else {
      return cb(
        `File format not allowed, allowed formats are: ${allowedFormat.join(
          ", "
        )}`
      );
    }
  };
  return multer({ storage, limits, fileFilter });
};

export const slugify = (
  text: string,
  options?: { lowerCase: boolean }
): string => {
  const { lowerCase = true } = options || {};
  if (lowerCase)
    return Slugify(text, {
      remove: /[*,}{》《`^#+~.()%&'"!:@]/g,
      lower: true,
    });

  return Slugify(text, {
    remove: /[*,}{》《`^#+~.()%&'"!:@]/g,
    lower: false,
  });
};

/* Make a get request */
export const getContent = async ({
  url,
  method = "GET",
  headers = {},
  token = undefined,
  data = undefined,
}: {
  url: string;
  method?: "GET" | "DELETE";
  headers?: Record<string, any>;
  token?: string;
  data?: Record<string, any>;
}): Promise<AxiosResponse> => {
  try {
    headers["X-Requested-With"] = "XMLHttpRequest";
    token && (headers["Authorization"] = token);
    const payload: any = {
      method,
      url,
      headers,
    };

    if (data) payload.data = data;

    const result = await Axios(payload);

    return result.data;
  } catch (err: any) {
    throw err.response
      ? { ...err.response.data, httpStatusCode: err.response.status } ||
          err.response
      : err;
  }
};
/* Make a post request */
export const postContent = async ({
  url,
  token,
  data,
  method = "POST",
  headers = {},
}: {
  url: string;
  token?: string;
  data?: Record<string, any>;
  method?: "POST" | "PATCH" | "PUT";
  headers?: Record<string, any>;
}): Promise<AxiosResponse> => {
  try {
    headers["X-Requested-With"] = "XMLHttpRequest";
    token && (headers["Authorization"] = token);

    const result = await Axios({
      method,
      url,
      data,
      headers,
    });

    return result.data;
  } catch (err: any) {
    throw err.response
      ? { ...err.response.data, httpStatusCode: err.response.status } ||
          err.response
      : err;
  }
};

export const paginate = (
  totalCount: number,
  currentPage: number,
  perPage: number
): Record<string, any> => {
  const previousPage = currentPage - 1;
  return {
    pageCount: Math.ceil(totalCount / perPage),
    offset: currentPage > 1 ? previousPage * perPage : 0,
  };
};

export const decodeJwt = (cipher: any, secreteKey: string): Promise<any> => {
  const token = cipher.split(" ").pop();
  return new Promise((ful, rej) => {
    if (!secreteKey) return rej(new Error("Kindly supply secret key"));
    jwt.verify(token, secreteKey, (err: any, data: any) => {
      if (err) rej(err);
      return ful(data);
    });
  });
};

export const encodeJwt = ({
  data,
  secreteKey = process.env.APP_KEY,
  duration = "24h",
}: {
  data: any;
  secreteKey: string;
  duration: string;
}): Promise<any> => {
  return new Promise((ful, rej) => {
    if (!secreteKey) return rej(new Error("Kindly supply secret key"));
    jwt.sign(data, secreteKey, { expiresIn: duration }, (err, token) => {
      if (err) rej(err);
      ful(token);
    });
  });
};

export function globalErrorHandler(err: Error): void {
  console.log("=======Unhandled error=======/n/n", err);
}

export function devLog(...keys: any): void {
  if (process.env.NODE_ENV !== "production") {
    const title = typeof keys[0] === "string" ? keys.shift() : "Log start";
    console.log(
      `\n\n\n=============${title}\n${new Date()}===================\n`
    );
    keys.forEach((log: any) => console.log(log));
    console.log("\n==============Log end==================\n");
  }
}

export function parseJSON(value: any): any {
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
}

export const uuid = {
  toBinary: (uuid?: string): Buffer | any => {
    if (!uuid) uuid = uuidV1();
    else if (typeof uuid !== "string" && Buffer.isBuffer(uuid)) return uuid;
    const buf = Buffer.from(uuid.replace(/-/g, ""), "hex");
    return Buffer.concat([
      buf.subarray(6, 8),
      buf.subarray(4, 6),
      buf.subarray(0, 4),
      buf.subarray(8, 16),
    ]);
  },
  toString: (binary: Buffer): string => {
    if (!binary) throw new Error("Kindly supply binary UUID value");
    if (typeof binary === "string") return binary;
    return [
      binary.toString("hex", 4, 8),
      binary.toString("hex", 2, 4),
      binary.toString("hex", 0, 2),
      binary.toString("hex", 8, 10),
      binary.toString("hex", 10, 16),
    ].join("-");
  },
  mysqlBinary: (value: any): any => Sequelize.fn("UUID_TO_BIN", value, 1),
  mysqlUUID: (field: any): any => [
    Sequelize.fn("BIN_TO_UUID", Sequelize.col(field), 1),
    field,
  ],
  get: (): string => uuidV1(),
  isValid: (uuid: string): boolean => UUIDValidaton(uuid),
  manyToString: (data: any, keys = []) => {
    if (!data) return;
    keys.forEach((key) => {
      if (data[key]) data[key] = uuid.toString(data[key]);
    });
    return data;
  },
  manyToBinary: (data: any, keys = []) => {
    if (!data) return;
    keys.forEach((key) => {
      if (data[key]) data[key] = uuid.toBinary(data[key]);
    });
    return data;
  },
};

export const fileManager = {
  upload:
    (location = "s3") =>
    async (req: any, res: any, next: any) => {
      try {
        const pipe = req.pipe(
          request(process.env.FILE_MANAGER_URL + "/file-upload/" + location)
        );
        const chunks: any = [];
        pipe.on("data", (chunk: any) => chunks.push(chunk));
        pipe.on("end", () => {
          let result = Buffer.concat(chunks).toString() as any;
          result = JSON.parse(result);
          if (result.success === false) {
            res.send(result);
            return res.end();
          }
          for (let key in result) req[key] = result[key];
          return next();
        });
      } catch (err) {
        next(err);
      }
    },

  uploadBase64: async (file: any) => {
    try {
      const result = (await postContent({
        url: process.env.FILE_MANAGER_URL + "/file-upload/base64",
        data: { file },
      })) as any;
      return result.file.relativeUrl;
    } catch (err) {
      throw err;
    }
  },

  remove: async (fileUrl: string | Array<string>) => {
    if (!fileUrl) return;
    await getContent({
      url: process.env.FILE_MANAGER_URL,
      method: "DELETE",
      data: { fileUrl, throwError: false },
    });
  },

  resizeImage: async (
    fileUrl: string,
    width = 500,
    height: number
  ): Promise<any> =>
    await postContent({
      url: process.env.FILE_MANAGER_URL + "/resize-image",
      data: { fileUrl, width, height },
    }),

  exists: async (fileUrl: string): Promise<any> =>
    await postContent({
      url: process.env.FILE_MANAGER_URL + "/exists",
      data: { fileUrl },
    }),

  url: (relativeUrl: string): string => {
    if (!relativeUrl) return "";

    const urlToken = relativeUrl.split("://");
    if (urlToken.length > 1) return relativeUrl;

    const [prefix] = relativeUrl.split("-");
    let baseUrl = process.env.FILE_MANAGER_MEDIA_URL + "/";
    let imageUrl = "";
    if (prefix === "s3") {
      baseUrl = process.env.AWS_S3_BASE_URL + "/";
      imageUrl = baseUrl + relativeUrl;
    } else {
      imageUrl =
        "https://contentionary.s3.eu-west-3.amazonaws.com/s3-2022/4/31/89f170b0-e18e-11ec-bf3f-4919075348fd.jpeg";
    }
    return imageUrl;
  },
};

export const urlQueryToString = (query: any) => {
  let queryString = "?";
  for (let key in query) queryString += `${key}=${query[key]}&`;
  return queryString;
};

export const rand = (min = 0, max = 10000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const auth = {
  isCentreSubscriber: (user: any, centreId: any) =>
    !user
      ? false
      : user.subscribedCentres.includes(centreId) ||
        auth.isCentreManager(user, centreId),

  isExamSubscriber: (user: any, examId: any, centreId: any) =>
    !user
      ? false
      : user.subscribedExams.includes(examId) ||
        auth.isCentreManager(user, centreId),

  isCentreManager: (user: any, centreId: any) =>
    !user
      ? false
      : user.managingCentres.includes(centreId) ||
        user.ownCentres.includes(centreId),

  isCenterOwner: (user: any, centreId: any) =>
    !user ? false : user.ownCentres.includes(centreId),

  isPublicationSubscriber: (
    user: any,
    centreId: string,
    publicationId: string
  ) =>
    !user
      ? false
      : user.subscribedPublications.includes(publicationId) ||
        auth.isCentreManager(user, centreId),

  isCourseSubscriber: (user: any, centreId: string, courseId: string) =>
    !user
      ? false
      : user.subscribedCourses.includes(courseId) ||
        auth.isCentreManager(user, centreId),
};

export const redirect = (
  url: string,
  config?: {
    redirectUrl?: string;
    isBaseUrl?: boolean;
    updateCentreAuth?: boolean;
    addUserId?: boolean;
    addTokenRef?: boolean;
    userData?: Array<string>;
    addPermission?: "publication" | "course" | "league" | "exam";
  }
) => {
  return async (req: Request | any, res: Response) => {
    try {
      const {
        isBaseUrl = true,
        updateCentreAuth = false,
        addUserId = true,
        addTokenRef = false,
        userData = [],
        redirectUrl,
        addPermission,
      } = config || {};

      let payload: Record<string, any> = {
        method: req.method,
        headers: {},
        data: req.body,
        url,
      };

      if (redirectUrl) {
        const utoken = req.url.split("/");
        const fUrlToken = redirectUrl.split("/:");
        const urlTokenLength = fUrlToken.length;
        const fUrl = fUrlToken
          .map((item, index) => {
            const token = parseInt(item);
            if (isNaN(token))
              return urlTokenLength - 1 === index ? item : `${item}/`;
            return urlTokenLength - 1 === index
              ? `${utoken[token]}`
              : `${utoken[token]}/`;
          })
          .join("");

        payload.url = `${url}${fUrl}`;
      } else {
        payload.url += req.url;
      }

      const user = req?.user;

      if (req.headers.authorization)
        payload.headers["authorization"] = req.headers.authorization;
      if (req.file) payload.data.file = req.file;
      if (req.files) payload.data.files = req.files;
      if (addUserId && user) payload.headers.userId = user.id;
      if (addTokenRef && user) payload.headers.tokenRef = user.tokenRef;
      if (req.headers.contentid)
        payload.headers.contentid = req.headers.contentid;
      if (req.headers.transactionkey)
        payload.headers.transactionkey = req.headers.transactionkey;
      if (userData.length > 0 && user) {
        userData.forEach((key) => {
          payload.data[key] = user[key];
        });
        if (userData.includes("name"))
          payload.data["name"] = `${user.firstname} ${user.lastname}`;
        if (payload.data.id) {
          payload.data.userId = user.id;
          delete payload.data.id;
        }
      }
      const response = await Axios(payload);

      if (addPermission && user) {
        const permissions: any = {};
        if (addPermission === "course") {
          const { centreId, courseId = null } = req.params;

          permissions.isCentreManager = auth.isCentreManager(user, centreId);
          permissions.isCentreSubscriber = auth.isCentreSubscriber(
            user,
            centreId
          );
          if (courseId)
            permissions.isCourseSubscriber = auth.isCourseSubscriber(
              user,
              centreId,
              courseId
            );
        } else if (addPermission === "publication") {
          const { centreId, publicationId } = req.params;

          permissions.isCentreManager = auth.isCentreManager(user, centreId);
          permissions.isCentreSubscriber = auth.isCentreSubscriber(
            user,
            centreId
          );
          if (publicationId)
            permissions.isPublicationSubscriber = auth.isPublicationSubscriber(
              user,
              centreId,
              publicationId
            );
        }

        response.data.auth = permissions;
      }

      res.status(response.status).json(response.data);
      res.end();
    } catch (err: any) {
      const data = err.response ? err.response.data : errorMessage(err);
      res.status(data.httpStatusCode || 500).json(data);
    }
  };
};
