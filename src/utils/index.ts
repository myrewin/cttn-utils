import { access, unlink, constants, mkdir, writeFile } from "fs";

import { Request, Response, NextFunction } from "express";
import multer from "multer";
import Slugify from "slugify";
import Axios from "axios";
import jwt from "jsonwebtoken";

import { v1 as uuidV1, validate as UUIDValidaton } from "uuid";

import { ValidationError } from "../errors/index.js";
import got from "got";

export const CONTENT_GROUP = ["video", "audio", "document", "image", "others"];

export const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  video: ["3gp", "mp4", "mov", "flv", "wmv", "avi", "mpeg"],
  audio: ["wav", "mp3", "wma", "3ga", "mpeg", "wave"],
  image: ["jpg", "jpeg", "png", "gif", "webp"],
  document: [
    "doc",
    "pdf",
    "csv",
    "docx",
    "zip",
    "xlsx",
    "xls",
    "rtf",
    "ppt",
    "pptx",
  ],
  others: ["zip"],
};

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
}): Promise<Record<string, any>> => {
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
}): Promise<Record<string, any>> => {
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
  toBinary: (uuid?: any): any => {
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
  toString: (binary: any): string => {
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
      const pipe = req.pipe(got.post(process.env.FILE_MANAGER_URL + "/file-upload/" + location, { isStream: true }))
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

      pipe.on("error", (err: any) => {
        res.status(500).send("File Upload Connection Error")
        throw err
      })
      
    } catch (err) {
      throw err
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

  remove: async (fileUrl: string | Array<string>, bunnyVideoId?: string) => {
    if (!fileUrl) return;
    fileUrl = typeof fileUrl === "string" ? fileUrl : JSON.stringify(fileUrl);
    await getContent({
      url: bunnyVideoId
        ? `${process.env.FILE_MANAGER_URL}?fileUrl=${fileUrl}&bunnyVideoId=${bunnyVideoId}`
        : `${process.env.FILE_MANAGER_URL}?fileUrl=${fileUrl}`,
      method: "DELETE",
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

  getFileFormat: (file: string): string => {
    if (!file) return file;
    const format = file.split(".").pop() as string;
    let fileType = null;
    for (let type in ALLOWED_FILE_TYPES) {
      if (ALLOWED_FILE_TYPES[type].includes(format)) fileType = type;
    }
    if (fileType === null)
      throw new ValidationError(`File type(${format}) is not supported`);
    return fileType;
  },

  url: (relativeUrl: string): string => {
    if (!relativeUrl) return relativeUrl;

    const urlToken = relativeUrl.split("://");
    if (urlToken.length > 1) return relativeUrl;

    const [prefix] = relativeUrl.split("-");
    const format = fileManager.getFileFormat(relativeUrl);
    let fullPath = "Invalid";
    if (prefix === "s3") {
      fullPath = `${process.env.AWS_S3_BASE_URL}/${relativeUrl}`;
    } else {
      fullPath =
        "https://contentionary.s3.eu-west-3.amazonaws.com/s3-2022/4/31/89f170b0-e18e-11ec-bf3f-4919075348fd.jpeg";
    }
    return fullPath;
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
