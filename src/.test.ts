import {
  expect,
  it,
  describe,
  afterAll,
  afterEach,
  beforeEach,
  jest,
  test
} from "@jest/globals";
import {Redis,delRedis,getRedis,setRedis,setRedisEx} from './database/redis'

describe("UTILS TESTING", () => {
  describe("====== Redis Test =======", () => {
    const redisData = {
      username: "contentionary",
      description: "All about redis",
    };
    const redisKey = "contentionary";

    // afterAll(async () => {
    //   await Redis.quit();
    // });

    it.only("should return OK if a data is stored in cache ", async () => {
      try {
        const setter = await setRedis(redisKey, redisData);
        console.log(setter)
        //expect(setter).toEqual("OK");
      } catch (err) {
        console.log(err);
        // expect(err.message).toThrow("ValidationError");
      }
    });

    // it("should return OK if redis data is cached with expiration ", async () => {
    //   try {
    //     const redisDetails = [
    //       redisData,
    //       { about: "This is contentionary" },
    //       { description: "Updates description" },
    //     ];
    //     for (const data of redisDetails) {
    //       const setter = await setRedisEx(redisKey, data, 300);
    //       expect(setter).toEqual("OK");
    //     }
    //   } catch (err) {
    //     expect(err.message).toBe("Redis Cache Key is required");
    //   }
    // });

    // it("should return defined string data if key is found ", async () => {
    //   try {
    //     const getter = await getRedis(redisKey);
    //     expect(getter).toBeDefined();
    //     expect(getter).not.toBeNull();
    //   } catch (err) {
    //     expect(err.message).toBe(
    //       "VALIDATION_ERROR: Redis Cache Key is required"
    //     );
    //   }
    // });

    // it("should return 1 cache data is deleted ", async () => {
    //   try {
    //     const remover = await delRedis(redisKey);
    //     expect(remover).toBe(1);
    //   } catch (err) {
    //     expect(err.message).toBe(
    //       "VALIDATION_ERROR: Redis Cache Key is required"
    //     );
    //   }
    // });
  });

//   describe("======== UUID Test ========", () => {
//     it("should return Buffer data string paramters and empty parameters", () => {
//       const uuidData = ["33180371-1c95-11ed-9a49-2fc384ff91d8", "", "2344"];
//       for (const data of uuidData) {
//         const result = uuid.toBinary(data);

//         expect(typeof result).toBe("object");
//         expect(result).toEqual(expect.any(Buffer));
//       }
//     });

//     it("should return string representation of Buffer", () => {
//       try {
//         const data = "<Buffer 11 ed 1d ae bd ef d5 80 88 88 2f 1e 3d 23 2b 96>";
//         for (const res of data) {
//           const result = uuid.toString(Buffer.from(res));
//           expect(result).toEqual(expect.any(String));
//         }
//       } catch (err) {
//         expect(err.message).toBe("Redis Cache Key is required");
//       }
//     });

//     it("should return string uuid", () => {
//       const tries = jest.spyOn(uuid, "get");
//       for (let i = 0; i < 5; i++) {
//         const data = uuid.get();
//         expect(data).toEqual(expect.any(String));
//       }
//       expect(tries).toHaveBeenCalledTimes(5);
//     });

//     it("should return true for valid uuid string", () => {
//       try {
//         const uuidString = "33180371-1c95-11ed-9a49-2fc384ff91d8";
//         const result = uuid.isValid(uuidString);
//         expect(result).toBe(true);
//       } catch (err) {
//         expect(err).toBe(false);
//       }
//     });
//   });

//   describe("======== INDEX Test =======", () => {
//     afterEach(() => {
//       jest.resetAllMocks();
//     });
//     const emailData = {
//       to: "ndamatiprecious@gmail.com",
//       subject: "Test",
//       message: "This is a test email",
//       template: "account-creation-welcome-mail",
//     };

//     it("should return return true for email sending", async () => {
//       try {
//         const sendEmail = await sendMail(emailData);
//         expect(sendEmail).toBe(true);
//       } catch (err) {
//         expect(err.message).toBe("Mail sending failed");
//       }
//     });

//     it("should return response from api", async () => {
//       const fileUrl = "contentionaryw.png";
//       const data = { success: true, message: "deleted" };
//       mockedCall.getContent.mockResolvedValue(data);

//       await fileManager.remove(fileUrl);

//       expect(mockedCall.getContent).toHaveBeenCalled();
//       expect(mockedCall.getContent).toHaveBeenCalledTimes(1);
//       expect(mockedCall.getContent).toHaveBeenCalledWith({
//         url: process.env.FILE_MANAGER_URL,
//         method: "DELETE",
//         data: { fileUrl, throwError: false },
//       });
//     });

//     it("should check if url parsed exits", async () => {
//       const fileUrl = "contentionaryw.png";
//       const mock = jest.spyOn(iyasunday, "postContent");

//       await fileManager.exists(fileUrl);

//       expect(mock).toHaveBeenCalledWith({
//         url: process.env.FILE_MANAGER_URL + "/exists",
//         data: { fileUrl },
//       });
//       expect(mock).toHaveBeenCalledTimes(1);
//     });

//     it("should return full fileUrl for images", async () => {
//       const fileUrl = "contentionaryw.png";
//       const baseUrl = process.env.FILE_MANAGER_MEDIA_URL + "/" + fileUrl;
//       mockedCall.postContent.mockResolvedValue(baseUrl);

//       const res = fileManager.url(fileUrl);
//       expect(res).toEqual(baseUrl);
//     });
//   });
});
