const userService = require("../src/services/userService.js");
const questionService = require("../src/services/questionService.js");
const gameService = require("../src/services/gameService.js");

const userDAO = require("../src/dao/userDAO.js");
const questionDAO = require("../src/dao/questionDAO.js");
const gameDAO = require("../src/dao/gameDAO.js");

const bcrypt = require("bcrypt");

describe("User Service Testing", () => {
    var spyFind, spyGet, spyUpdate, spyDelete, spyRegister;

    beforeAll(() => {
        spyFind = jest.spyOn(userDAO, 'findUserById');
        spyGet = jest.spyOn(userDAO, 'getUserByUsername')
        spyUpdate = jest.spyOn(userDAO, 'updateUser');
        spyDelete = jest.spyOn(userDAO, 'deleteUserById');
        spyRegister = jest.spyOn(userDAO, 'registerNewUser');
    });
    afterEach(() => {
        spyFind.mockClear();
        spyGet.mockClear();
        spyUpdate.mockClear();
        spyDelete.mockClear();
        spyRegister.mockClear();
    });

    test("Login Success", async () => {
        spyGet.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10)}; });
        const username = "username";
        const password = "password";

        const result = await userService.validateUserLogin(username, password);

        expect(result).toBeTruthy();
        expect(result.username).toBe("username");
        expect(spyGet).toHaveBeenCalledTimes(1);
    });

    test("Login Username not found", async () => {
        spyGet.mockImplementation(async () => {return null});
        const username = "username";
        const password = "password";

        const result = await userService.validateUserLogin(username, password);

        expect(result).toBeNull();
        expect(spyGet).toHaveBeenCalledTimes(1);
    });

    test("Login Bad Password", async () => {
        spyGet.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10)}; });
        const username = "username";
        const password = "BAD_PASSWORD";

        const result = await userService.validateUserLogin(username, password);

        expect(result).toBeNull();
        expect(spyGet).toHaveBeenCalledTimes(1);
    });

    test("Register Success", async () => {
        spyGet.mockImplementation(async () => {return null;});
        spyRegister.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10)};});
        const username = "username";
        const passwordHash = "password";
        const user = {username, passwordHash}

        const result = await userService.registerNewUser(user);

        expect(result).toBeTruthy();
        expect(spyRegister).toHaveBeenCalledTimes(1);
    });

    // Could be deleted if validation done in controller layer...
    test("Register Same Username", async () => {
        spyGet.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10)}; });
        spyRegister.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10)};});
        const username = "username";
        const passwordHash = "password";
        const user = {username, passwordHash}

        const result = await userService.registerNewUser(user);

        expect(result).toBeFalsy();
        expect(spyRegister).toHaveBeenCalledTimes(0);
    });

    test("Register Missing Field", async () => {
        spyGet.mockImplementation(async () => {return null; });
        spyRegister.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10)};});
        const passwordHash = "password";
        const user = {passwordHash}

        const result = await userService.registerNewUser(user);

        expect(result).toBeFalsy();
        expect(spyRegister).toHaveBeenCalledTimes(0);
    });

    test("Update Profile success", async () => {
        spyUpdate.mockImplementation(async (u) => {return u;});
        const user = {username: "username", passwordHash: await bcrypt.hash("password", 10)};

        const result = await userService.updateProfile(user, "newPassword");

        expect(result).toBeTruthy();
        expect(await bcrypt.compare("newPassword", result.passwordHash)).toBeTruthy();
        expect(spyUpdate).toHaveBeenCalledTimes(1);
    });

    test("Update Profile does not update anything but password ", async () => {
        spyUpdate.mockImplementation(async (u) => {return u;});
        const user = {username: "username", passwordHash: await bcrypt.hash("password", 10), hi_score: 300 };

        const result = await userService.updateProfile(user, "newPassword");

        expect(result).toBeTruthy();
        expect(result.hi_score).toBe(300);
        console.log(result.passwordHash)
        expect(await bcrypt.compare("newPassword", result.passwordHash)).toBeTruthy();
        expect(spyUpdate).toHaveBeenCalledTimes(1);
    });

    test("Update fails on invalid type", async () => {
        spyUpdate.mockImplementation(async (u) => {return u;});
        const user = {username: "username", passwordHash: await bcrypt.hash("password", 10)};

        const result = await userService.updateProfile(user, 500);

        expect(result).toBeFalsy();
        expect(spyUpdate).toHaveBeenCalledTimes(0);
    });

    test("Update Account for admin", async () => {
        spyUpdate.mockImplementation(async (u) => {return u;});
        const user = {username: "username", passwordHash: await bcrypt.hash("password", 10)};
        const newUser = {username: "username", password: "newPassword"};

        const result = await userService.updateAccount(user, newUser);

        expect(result).toBeTruthy();
        expect(result.username).toBe("username");
        expect(await bcrypt.compare("newPassword", result.passwordHash)).toBeTruthy();
        expect(spyUpdate).toHaveBeenCalledTimes(1);
    });

    
    test("Update account does not update protected attributes", async () => {
        spyUpdate.mockImplementation(async (u) => {return u});
        const user = {username: "username", passwordHash: await bcrypt.hash("password", 10), hi_score: 0, role: "PLAYER"};
        const newUser = {username: "username", password: "newPassword", hi_score: 50, role: "ADMIN" };

        const result = await userService.updateAccount(user, newUser);

        expect(result).toBeTruthy();
        expect(result.username).toBe("username");
        expect(await bcrypt.compare("newPassword", result.passwordHash)).toBeTruthy();
        expect(result.hi_score).toBe(50);
        expect(result.role).toBe("PLAYER");
        expect(spyUpdate).toHaveBeenCalledTimes(1);
    });


    test("Update Does not add attribute", async () => {
        spyUpdate.mockImplementation(async (u) => {return u});
        const user = {username: "username", passwordHash: await bcrypt.hash("password", 10)};
        const newUser = {username: "username", password: "newPassword", MADE_UP_ATTRIBUTE: "I should not be added." };

        const result = await userService.updateAccount(user, newUser);

        expect(result).toBeTruthy();
        expect(result.username).toBe("username");
        expect(await bcrypt.compare("newPassword", result.passwordHash)).toBeTruthy();
        expect(result.MADE_UP_ATTRIBUTE).toBeUndefined();
        expect(spyUpdate).toHaveBeenCalledTimes(1);
    });

    test("Delete Success", async () => {
        spyDelete.mockImplementation(async () => {return true});

        const result = await userService.deleteUserById("Example_Existing_Id");

        expect(result).toBeTruthy();
        expect(spyDelete).toHaveBeenCalledTimes(1);
    });

    test("Delete Id does not exist", async () => {
        spyDelete.mockImplementation(async () => {return false});

        const result = await userService.deleteUserById("Example_Existing_Id");

        expect(result).toBeFalsy();
        expect(spyDelete).toHaveBeenCalledTimes(1);
    });

});

describe("Question Service Testing", () => {
    var spyCreate, spyUpdate;

    beforeAll(() => {
        spyCreate = jest.spyOn(questionDAO, 'createQuestion');
        spyUpdate = jest.spyOn(questionDAO, 'updateQuestionStatus');
    });
    afterEach(() => {
        spyCreate.mockClear();
        spyUpdate.mockClear();
    });

    test("Create question success", async () => {

    });
});