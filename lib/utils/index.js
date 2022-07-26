"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = exports.parseJSON = exports.devLog = exports.globalErrorHandler = exports.encodeJwt = exports.decodeJwt = exports.paginate = exports.postContent = exports.getContent = exports.slugify = exports.uploadFile = exports.joiValidator = exports.deleteFile = exports.shuffelWord = void 0;
const fs_1 = require("fs");
const multer_1 = __importDefault(require("multer"));
const slugify_1 = __importDefault(require("slugify"));
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const errors_1 = require("../errors");
const sequelize_1 = require("sequelize");
const fileExists = (file) => {
    return new Promise((resolve, reject) => {
        (0, fs_1.access)(file, fs_1.constants.F_OK, (err) => {
            if (err)
                resolve(false);
            resolve(true);
        });
    });
};
const shuffelWord = (word) => {
    let shuffledWord = "";
    word = word.split("");
    while (word.length > 0) {
        shuffledWord += word.splice((word.length * Math.random()) << 0, 1);
    }
    return shuffledWord;
};
exports.shuffelWord = shuffelWord;
const deleteFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield fileExists(file)) {
        return new Promise((resolve, reject) => {
            (0, fs_1.unlink)(file, (err) => {
                return err ? reject(err) : resolve(true);
            });
        });
    }
    return false;
});
exports.deleteFile = deleteFile;
const validate = (schema, object, option = { abortEarly: true, allowUnknown: false }) => {
    const check = schema.validate(object, option);
    if (check.error) {
        throw new errors_1.ValidationError(check.error.details[0].message);
    }
    return check.value;
};
function joiValidator(constraint, isMiddleware = true) {
    if (!constraint)
        throw new errors_1.ValidationError("Kindly supply validation schema to joiValidator");
    if (!isMiddleware) {
        return validate(constraint.schema, constraint.data, constraint.option);
    }
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (constraint.body) {
                req.body = validate(constraint.body.schema, req.body, constraint.body.options);
            }
            if (constraint.params)
                req.params = validate(constraint.params.schema, req.params, constraint.params.options);
            if (constraint.query)
                req.query = validate(constraint.query.schema, req.query, constraint.query.options);
            if (constraint.headers)
                req.headers = validate(constraint.headers.schema, req.headers, constraint.headers.options);
            return next();
        }
        catch (err) {
            next(err);
        }
    });
}
exports.joiValidator = joiValidator;
const randomString = (N = 10) => {
    return Array(N + 1)
        .join((Math.random().toString(36) + "00000000000000000").slice(2, 18))
        .slice(0, N);
};
const uniqueString = (capitalize = false) => {
    const now = Array.from(Date.now().toString());
    let result = "";
    for (let i = 0; i < now.length; i++) {
        if (i % 4 === 0)
            result += randomString(2);
        result += now[i];
    }
    return capitalize ? result.toUpperCase() : result;
};
const createPath = (path) => new Promise((ful, rej) => {
    fileExists(path)
        .then((exists) => {
        if (exists)
            return ful(true);
        (0, fs_1.mkdir)(path, { recursive: true }, (err) => {
            if (err)
                return rej(err);
            return ful(true);
        });
    })
        .catch((err) => rej(err));
});
const uploadFile = ({ name = undefined, limit = 5, allowedFormat = ["jpg", "jpeg", "png", "gif"], location = "/", }) => {
    /* Set storage to s3 */
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => __awaiter(void 0, void 0, void 0, function* () {
            yield createPath(location);
            cb(null, location);
        }),
        filename: (req, file, cb) => {
            let mimetype = file.mimetype.split("/")[1];
            cb(null, name ? name + "." + mimetype : `${uniqueString()}.${mimetype}`);
        },
    });
    /* Limit is converted to bytes from megabyte */
    const limits = { fileSize: limit * 1000000 };
    /* Restrict file format to allowed ones */
    const fileFilter = (req, file, cb) => {
        if (allowedFormat.length === 0)
            return cb(null, true);
        if (allowedFormat.includes(file.originalname.split(".").pop().toLowerCase())) {
            return cb(null, true);
        }
        else {
            return cb(`File format not allowed, allowed formats are: ${allowedFormat.join(", ")}`);
        }
    };
    return (0, multer_1.default)({ storage, limits, fileFilter });
};
exports.uploadFile = uploadFile;
const slugify = ({ value, lowerCase = true, }) => {
    if (lowerCase)
        return (0, slugify_1.default)(value, {
            remove: /[*,}{》《`^#+~.()%&'"!:@]/g,
            lower: true,
        });
    return (0, slugify_1.default)(value, {
        remove: /[*,}{》《`^#+~.()%&'"!:@]/g,
        lower: false,
    });
};
exports.slugify = slugify;
/* Make a get request */
const getContent = ({ url, method = "GET", headers = {}, token = undefined, data = undefined, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        headers["X-Requested-With"] = "XMLHttpRequest";
        token && (headers["Authorization"] = token);
        const payload = {
            method,
            url,
            headers,
        };
        if (data)
            payload.data = data;
        const result = yield (0, axios_1.default)(payload);
        return result.data;
    }
    catch (err) {
        throw err.response
            ? Object.assign(Object.assign({}, err.response.data), { httpStatusCode: err.response.status }) ||
                err.response
            : err;
    }
});
exports.getContent = getContent;
/* Make a post request */
const postContent = ({ url, token, data, method = "POST", headers = {}, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        headers["X-Requested-With"] = "XMLHttpRequest";
        token && (headers["Authorization"] = token);
        const result = yield (0, axios_1.default)({
            method,
            url,
            data,
            headers,
        });
        return result.data;
    }
    catch (err) {
        if (err) {
            if (err.response) {
                throw Object.assign(Object.assign({}, err.response.data), { httpStatusCode: err.response.status }) || err.response;
            }
            else
                throw err;
        }
    }
});
exports.postContent = postContent;
const paginate = (totalCount, currentPage, perPage) => {
    const previousPage = currentPage - 1;
    return {
        pageCount: Math.ceil(totalCount / perPage),
        offset: currentPage > 1 ? previousPage * perPage : 0,
    };
};
exports.paginate = paginate;
const decodeJwt = (cipher, secreteKey) => {
    const token = cipher.split(" ").pop();
    return new Promise((ful, rej) => {
        if (!secreteKey)
            return rej(new Error("Kindly supply secret key"));
        jsonwebtoken_1.default.verify(token, secreteKey, (err, data) => {
            if (err)
                rej(err);
            return ful(data);
        });
    });
};
exports.decodeJwt = decodeJwt;
const encodeJwt = ({ data, secreteKey = process.env.APP_KEY, duration = "24h", }) => {
    return new Promise((ful, rej) => {
        if (!secreteKey)
            return rej(new Error("Kindly supply secret key"));
        jsonwebtoken_1.default.sign(data, secreteKey, { expiresIn: duration }, (err, token) => {
            if (err)
                rej(err);
            ful(token);
        });
    });
};
exports.encodeJwt = encodeJwt;
function globalErrorHandler(err) {
    console.log("=======Unhandled error=======/n/n", err);
}
exports.globalErrorHandler = globalErrorHandler;
function devLog(...keys) {
    if (process.env.NODE_ENV !== "production") {
        const title = typeof keys[0] === "string" ? keys.shift() : "Log start";
        console.log(`\n\n\n=============${title}\n${new Date()}===================\n`);
        keys.forEach((log) => console.log(log));
        console.log("\n==============Log end==================\n");
    }
}
exports.devLog = devLog;
function parseJSON(value) {
    try {
        return JSON.parse(value);
    }
    catch (err) {
        return err;
    }
}
exports.parseJSON = parseJSON;
exports.uuid = {
    toBinary: (uuid) => {
        if (!uuid)
            uuid = (0, uuid_1.v1)();
        else if (typeof uuid !== "string" && Buffer.isBuffer(uuid))
            return uuid;
        const buf = Buffer.from(uuid.replace(/-/g, ""), "hex");
        return Buffer.concat([
            buf.subarray(6, 8),
            buf.subarray(4, 6),
            buf.subarray(0, 4),
            buf.subarray(8, 16),
        ]);
    },
    toString: (binary) => {
        if (!binary)
            throw new Error("Kindly supply binary UUID value");
        if (typeof binary === "string")
            return binary;
        return [
            binary.toString("hex", 4, 8),
            binary.toString("hex", 2, 4),
            binary.toString("hex", 0, 2),
            binary.toString("hex", 8, 10),
            binary.toString("hex", 10, 16),
        ].join("-");
    },
    mysqlBinary: (value) => sequelize_1.Sequelize.fn("UUID_TO_BIN", value, 1),
    mysqlUUID: (field) => [
        sequelize_1.Sequelize.fn("BIN_TO_UUID", sequelize_1.Sequelize.col(field), 1),
        field,
    ],
    get: () => (0, uuid_1.v1)(),
    isValid: (uuid) => (0, uuid_1.validate)(uuid),
};
//# sourceMappingURL=index.js.map