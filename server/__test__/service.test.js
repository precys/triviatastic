const userService = require("../src/services/userService.js");
const questionService = require("../src/services/questionService.js");
const gameService = require("../src/services/gameService.js");

const userDAO = require("../src/dao/userDAO.js");
const questionDAO = require("../src/dao/questionDAO.js");
const gameDAO = require("../src/dao/gameDAO.js");

const bcrypt = require("bcrypt");

describe("User Service Testing", () => {
    var spyFind, spyGet, spyUpdate, spyDelete, spyRegister, spyFriends;

    beforeAll(() => {
        spyFind = jest.spyOn(userDAO, 'findUserById');
        spyGet = jest.spyOn(userDAO, 'getUserByUsername')
        spyUpdate = jest.spyOn(userDAO, 'updateUser');
        spyDelete = jest.spyOn(userDAO, 'deleteUserById');
        spyRegister = jest.spyOn(userDAO, 'createUser');

        spyFriends = jest.spyOn(userDAO, 'getUsersFriendsByUserId');
        spyCreateFriendRequest = jest.spyOn(userDAO, 'sendFriendRequest');
        spyUpdateFriendsList = jest.spyOn(userDAO, 'updateFriendsList');
        spyFriendsByStatus = jest.spyOn(userDAO, 'getFriendRequestsByStatus');
        spyRespond = jest.spyOn(userDAO, 'respondToFriendRequest');
        spyDeleteFriendRequest = jest.spyOn(userDAO, 'deleteFriendRequest');
    });
    afterEach(() => {
        spyFind.mockClear();
        spyGet.mockClear();
        spyUpdate.mockClear();
        spyDelete.mockClear();
        spyRegister.mockClear();

        spyFriends.mockClear();
        spyCreateFriendRequest.mockClear();
        spyUpdateFriendsList.mockClear();
        spyFriendsByStatus.mockClear();
        spyRespond.mockClear();
        spyDeleteFriendRequest.mockClear();
    });

    test("Login Success", async () => {
        spyGet.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10)}; });
        const username = "username";
        const password = "password";

        const result = await userService.loginUser({username, password}).catch((e) => {
            return null;
        });

        expect(result).toBeTruthy();
        expect(result.username).toBe("username");
        expect(spyGet).toHaveBeenCalledTimes(1);
    });

    test("Login Username not found", async () => {
        spyGet.mockImplementation(async () => {return null});
        const username = "username";
        const password = "password";

        const result = await userService.loginUser({username, password}).catch((e) => {
            return null;
        });

        expect(result).toBeNull();
        expect(spyGet).toHaveBeenCalledTimes(1);
    });

    test("Login Bad Password", async () => {
        spyGet.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10)}; });
        const username = "username";
        const password = "BAD_PASSWORD";

        const result = await userService.loginUser({username, password}).catch((e) => {
            return null;
        });

        expect(result).toBeNull();
        expect(spyGet).toHaveBeenCalledTimes(1);
    });

    test("Register Success", async () => {
        spyGet.mockImplementation(async () => {return null;});
        spyRegister.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10)};});
        const username = "username";
        const password = "password";
        const user = {username, password}

        const result = await userService.registerUser(user).catch((e) => {
            return null;
        });

        expect(result).toBeTruthy();
        expect(spyRegister).toHaveBeenCalledTimes(1);
    });

    // Could be deleted if validation done in controller layer...
    test("Register Same Username", async () => {
        spyGet.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10)}; });
        spyRegister.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10)};});
        const username = "username";
        const password = "password";
        const user = {username, password}

        const result = await userService.registerUser(user).catch((e) => {
            return null;
        });

        expect(result).toBeFalsy();
        expect(spyRegister).toHaveBeenCalledTimes(0);
    });

    test("Register Missing Field", async () => {
        spyGet.mockImplementation(async () => {return null; });
        spyRegister.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10)};});
        const passwordHash = "password";
        const user = {passwordHash}

        const result = await userService.registerUser(user).catch((e) => {
            return null;
        });

        expect(result).toBeFalsy();
        expect(spyRegister).toHaveBeenCalledTimes(0);
    });

    test("Update Profile success", async () => {
        spyUpdate.mockImplementation(async (u) => {return u;});
        const user = {username: "username", passwordHash: await bcrypt.hash("password", 10)};

        const result = await userService.updateProfile(user, "newPassword").catch((e) => {
            return null;
        });

        expect(result).toBeTruthy();
        expect(await bcrypt.compare("newPassword", result.passwordHash)).toBeTruthy();
        expect(spyUpdate).toHaveBeenCalledTimes(1);
    });

    test("Update Profile does not update anything but password ", async () => {
        spyUpdate.mockImplementation(async (u) => {return u;});
        const user = {username: "username", passwordHash: await bcrypt.hash("password", 10), hi_score: 300 };

        const result = await userService.updateProfile(user, "newPassword").catch((e) => {
            return null;
        });

        expect(result).toBeTruthy();
        expect(result.hi_score).toBe(300);
        console.log(result.passwordHash)
        expect(await bcrypt.compare("newPassword", result.passwordHash)).toBeTruthy();
        expect(spyUpdate).toHaveBeenCalledTimes(1);
    });

    test("Update fails on invalid type", async () => {
        spyUpdate.mockImplementation(async (u) => {return u;});
        const user = {username: "username", passwordHash: await bcrypt.hash("password", 10)};

        const result = await userService.updateProfile(user, 500).catch((e) => {
            return null;
        });

        expect(result).toBeFalsy();
        expect(spyUpdate).toHaveBeenCalledTimes(0);
    });

    test("Update Account for admin", async () => {
        spyUpdate.mockImplementation(async (u) => {return u;});
        const user = {username: "username", passwordHash: await bcrypt.hash("password", 10)};
        const newUser = {username: "username", password: "newPassword"};

        const result = await userService.updateAccount(user, newUser).catch((e) => {
            return null;
        });

        expect(result).toBeTruthy();
        expect(result.username).toBe("username");
        expect(await bcrypt.compare("newPassword", result.passwordHash)).toBeTruthy();
        expect(spyUpdate).toHaveBeenCalledTimes(1);
    });

    
    test("Update account does not update protected attributes", async () => {
        spyUpdate.mockImplementation(async (u) => {return u});
        const user = {username: "username", passwordHash: await bcrypt.hash("password", 10), hi_score: 0, role: "PLAYER"};
        const newUser = {username: "username", password: "newPassword", hi_score: 50, role: "ADMIN" };

        const result = await userService.updateAccount(user, newUser).catch((e) => {
            return null;
        });

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

        const result = await userService.updateAccount(user, newUser).catch((e) => {
            return null;
        });

        expect(result).toBeTruthy();
        expect(result.username).toBe("username");
        expect(await bcrypt.compare("newPassword", result.passwordHash)).toBeTruthy();
        expect(result.MADE_UP_ATTRIBUTE).toBeUndefined();
        expect(spyUpdate).toHaveBeenCalledTimes(1);
    });

    test("Update Does not add value below 0", async () => {
        spyUpdate.mockImplementation(async (u) => {return u});
        const user = {username: "username", passwordHash: await bcrypt.hash("password", 10), streak: 0};
        const newUser = {username: "username", password: "newPassword", streak: -10 };

        const result = await userService.updateAccount(user, newUser).catch((e) => {
            return null;
        });

        expect(result.streak).toBe(0);
        expect(spyUpdate).toHaveBeenCalledTimes(1);
    });

    test("Delete Success", async () => {
        spyFind.mockImplementation(async () => {return {user: "username", passwordHash: "whatever", friends: []}});
        spyDelete.mockImplementation(async () => {return true});
        spyUpdate.mockImplementation(async () => {return true});

        const result = await userService.deleteUserById("Example_Existing_Id").catch((e) => {
            return null;
        });

        expect(result).toBeTruthy();
        expect(spyFind).toHaveBeenCalledTimes(1);
        expect(spyUpdate).toHaveBeenCalledTimes(0);
        expect(spyDelete).toHaveBeenCalledTimes(1);
    });

    test("Delete Id does not exist", async () => {
        spyFind.mockImplementation(async () => {return null});
        spyDelete.mockImplementation(async () => {return false});
        spyUpdate.mockImplementation(async () => {return});

        const result = await userService.deleteUserById("Example_Existing_Id").catch((e) => {
            return null;
        });

        expect(result).toBeFalsy();
        expect(spyFind).toHaveBeenCalledTimes(1);
        expect(spyUpdate).toHaveBeenCalledTimes(0);
        expect(spyDelete).toHaveBeenCalledTimes(0);
    });

    test("Get friends success", async () => {
        spyFriends.mockImplementation(async () => {return ["Id1", "Id2"];});
        const user = {username: "username", passwordHash: await bcrypt.hash("password", 10)};

        const result = await userService.getUsersFriends(user);

        expect(result).toBeTruthy();
        expect(result["Friend Count"]).toBe(2);
        expect(result.friends.length).toBe(2);
        expect(spyFriends).toHaveBeenCalledTimes(1);
    });

    test("Get friends user does not exist", async () => {
        spyFriends.mockImplementation(async () => {return ["Id1", "Id2"];});

        const result = await userService.getUsersFriends(null).catch((error) => {return null;});

        expect(result).toBeFalsy;
        expect(spyFriends).toHaveBeenCalledTimes(0);
    });

    test("Send friend request success", async () => {
        spyCreateFriendRequest.mockImplementation(async () => {return;})
        spyFind.mockImplementation(async () => {return {username: "username2", passwordHash: await bcrypt.hash("password", 10), userId: "1", friends: []}; });
        spyGet.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10), userId: "2", friends: []}; });


        const result = await userService.sendFriendRequest("1", "username");

        expect(result).toBeTruthy();
        expect(result.message).toBeTruthy();
        expect(spyFind).toHaveBeenCalledTimes(1);
        expect(spyGet).toHaveBeenCalledTimes(1);
        expect(spyCreateFriendRequest).toHaveBeenCalledTimes(1);
    });

    test("Send friend same user", async () => {
        spyCreateFriendRequest.mockImplementation(async () => {return;})
        spyFind.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10), userId: "1", friends: []}; });
        spyGet.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10), userId: "1", friends: []}; });


        const result = await userService.sendFriendRequest("1", "username").catch((error) => {return null;});

        expect(result).toBeFalsy();
        expect(spyFind).toHaveBeenCalledTimes(1);
        expect(spyGet).toHaveBeenCalledTimes(1);
        expect(spyCreateFriendRequest).toHaveBeenCalledTimes(0);
    });

    test("Send friend no sender", async () => {
        spyCreateFriendRequest.mockImplementation(async () => {return;})
        spyFind.mockImplementation(async () => {return null;});
        spyGet.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10), userId: "1", friends: []}; });


        const result = await userService.sendFriendRequest("1", "username").catch((error) => {return null;});

        expect(result).toBeFalsy();
        expect(spyFind).toHaveBeenCalledTimes(1);
        expect(spyGet).toHaveBeenCalledTimes(1);
        expect(spyCreateFriendRequest).toHaveBeenCalledTimes(0);
    });

    
    test("Send friend no reciever", async () => {
        spyCreateFriendRequest.mockImplementation(async () => {return;})
        spyFind.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10), userId: "1", friends: []};});
        spyGet.mockImplementation(async () => {return null; });


        const result = await userService.sendFriendRequest("1", "username").catch((error) => {return null;});

        expect(result).toBeFalsy();
        expect(spyFind).toHaveBeenCalledTimes(1);
        expect(spyGet).toHaveBeenCalledTimes(1);
        expect(spyCreateFriendRequest).toHaveBeenCalledTimes(0);
    });
    
    test("Send friend already friends", async () => {
        spyCreateFriendRequest.mockImplementation(async () => {return;})
        spyFind.mockImplementation(async () => {return {username: "username2", passwordHash: await bcrypt.hash("password", 10), userId: "1", friends: ["2"]}; });
        spyGet.mockImplementation(async () => {return {username: "username", passwordHash: await bcrypt.hash("password", 10), userId: "2", friends: ["1"]}; });


        const result = await userService.sendFriendRequest("1", "username").catch((error) => {return null;});

        expect(result).toBeFalsy();
        expect(spyFind).toHaveBeenCalledTimes(1);
        expect(spyGet).toHaveBeenCalledTimes(1);
        expect(spyCreateFriendRequest).toHaveBeenCalledTimes(0);
    });

    test("Respond to friend request", async () => {
        spyRespond.mockImplementation(async () => {});
        
    });

    test("Get requests by status success", async() => {
        spyFriendsByStatus.mockImplementation(() => {return [{user_id: "ID1", status: "pending"}];});

        const result = await userService.getFriendRequestsByStatus("ID1", "pending");

        expect(result).toBeTruthy;
        expect(result.requests.length).toBe(1);
        expect(spyFriendsByStatus).toHaveBeenCalledTimes(1);
    });

    test("Get requests by invalid status", async() => {
        spyFriendsByStatus.mockImplementation(() => {return [{user_id: "ID1", status: "pending"}];});

        const result = await userService.getFriendRequestsByStatus("ID1", "INVALID_VALUE").catch((e) => {return null;});

        expect(result).toBeFalsy;
        expect(spyFriendsByStatus).toHaveBeenCalledTimes(0);
    });

    test("Delete friend request success", async() => {
        spyDeleteFriendRequest.mockImplementation(() => {return true;});

        const result = await userService.deleteFriendRequest("ID1", "ID2").catch((e) => {return null;});

        expect(result).toBeTruthy;
        expect(spyDeleteFriendRequest).toHaveBeenCalledTimes(1);
    });


    test("Delete friend request does not exist", async() => {
        spyDeleteFriendRequest.mockImplementation(() => {return null;});

        const result = await userService.deleteFriendRequest("ID1", "ID2").catch((e) => {return null;});

        expect(result).toBeFalsy;
        expect(spyDeleteFriendRequest).toHaveBeenCalledTimes(1);
    });


});

describe("Question Service Testing", () => {
    var spyCreate, spyUpdate, spyGetAll, spyFind, spyDelete;

    beforeAll(() => {
        spyCreate = jest.spyOn(questionDAO, 'createQuestion');
        spyUpdate = jest.spyOn(questionDAO, 'updateQuestionStatus');
        spyGetAll = jest.spyOn(questionDAO, 'getAllQuestionsByStatus');
        spyGetCategory = jest.spyOn(questionDAO, 'getAllQuestionsByCategory');
        spyFind = jest.spyOn(questionDAO, 'getQuestionById');
        spyDelete = jest.spyOn(questionDAO, 'deleteQuestion');
    });
    afterEach(() => {
        spyCreate.mockClear();
        spyUpdate.mockClear();
        spyGetAll.mockClear();
        spyGetCategory.mockClear();
        spyFind.mockClear();
        spyDelete.mockClear();
    });

    test("Create question success", async () => {
        spyCreate.mockImplementation(async (u) => {return u});

        const question = {
            type: "Multiple Choice",
            difficulty: "easy", 
            category: "history", 
            question: "What is my name?", 
            correct_answer: "I don't know", 
            incorrect_answers: ["Hunter", "Edwin", "Gwen", "Andrew"]
        };
        const result = await questionService.createQuestion(question, "Example_Id");
        
        expect(result).toBeTruthy();
        expect(result.PK).toBeTruthy();
        expect(result.SK).toBeTruthy();
        expect(result.userId).toBe("Example_Id");
        expect(spyCreate).toHaveBeenCalledTimes(1);

    });

    test("Create question missing fields", async () => {
        spyCreate.mockImplementation(async (u) => {return u});

        const question = {};

        const result = await questionService.createQuestion(question, "Example_Id");

        expect(result).toBeFalsy();
        expect(spyCreate).toHaveBeenCalledTimes(0);
    });

    test("Create question should ignore extra fields", async () => {
        spyCreate.mockImplementation(async (u) => {return u});

        const question = {
            type: "Multiple Choice",
            difficulty: "easy", 
            category: "history", 
            question: "What is my name?", 
            correct_answer: "I don't know", 
            incorrect_answers: ["Hunter", "Edwin", "Gwen", "Andrew"],
            EXTRA: "I SHOULD NOT BE ADDED"
        };
        const result = await questionService.createQuestion(question, "Example_Id");
        
        expect(result).toBeTruthy();
        expect(result.PK).toBeTruthy();
        expect(result.SK).toBeTruthy();
        expect(result.userId).toBe("Example_Id");
        expect(result.EXTRA).toBeUndefined();
        expect(spyCreate).toHaveBeenCalledTimes(1);
    });

    test("Create question null object", async () => {
        spyCreate.mockImplementation(async (u) => {return u});

        const question = undefined;

        const result = await questionService.createQuestion(question, "Example_Id");

        expect(result).toBeFalsy();
        expect(spyCreate).toHaveBeenCalledTimes(0);
    });

    test("Update question approve success", async () => {
        const question = {
            type: "Multiple Choice",
            difficulty: "easy", 
            question: "What is my name?", 
            correct_answer: "I don't know", 
            incorrect_answers: ["Hunter", "Edwin", "Gwen", "Andrew"],
            userId: "Example_Id",
            questionId: "Example_Question_Id",
            PK: "PK",
            SK: "SK",
            status: "pending",
            createdAt: new Date().toISOString(),
        };
        spyFind.mockImplementation(() => {return question;});
        spyUpdate.mockImplementation((u, status) => {
            u.status = status;
            return u;
        });
        spyDelete.mockImplementation(() => {return true;});

        const result = await questionService.updateQuestionStatus("Example_Question_Id", "approved");

        expect(result).toBeTruthy();
        expect(result.status).toBe("approved");
        expect(spyFind).toHaveBeenCalledTimes(1);
        expect(spyUpdate).toHaveBeenCalledTimes(1);
        expect(spyDelete).toHaveBeenCalledTimes(0);
    });

    test("Update question deny success", async () => {
        const question = {
            type: "Multiple Choice",
            difficulty: "easy", 
            question: "What is my name?", 
            correct_answer: "I don't know", 
            incorrect_answers: ["Hunter", "Edwin", "Gwen", "Andrew"],
            userId: "Example_Id",
            questionId: "Example_Question_Id",
            PK: "PK",
            SK: "SK",
            status: "pending",
            createdAt: new Date().toISOString(),
        };
        spyFind.mockImplementation(() => {return question;});
        spyUpdate.mockImplementation((u, status) => {
            u.status = status;
            return u;
        });
        spyDelete.mockImplementation(() => {return true;});

        const result = await questionService.updateQuestionStatus("Example_Question_Id", "denied");

        expect(result).toBeTruthy();
        expect(spyFind).toHaveBeenCalledTimes(1);
        expect(spyUpdate).toHaveBeenCalledTimes(0);
        expect(spyDelete).toHaveBeenCalledTimes(1);
    });

    test("Update question invalid status", async () => {
        const question = {
            type: "Multiple Choice",
            difficulty: "easy", 
            question: "What is my name?", 
            correct_answer: "I don't know", 
            incorrect_answers: ["Hunter", "Edwin", "Gwen", "Andrew"],
            userId: "Example_Id",
            questionId: "Example_Question_Id",
            PK: "PK",
            SK: "SK",
            status: "pending",
            createdAt: new Date().toISOString(),
        };
        spyFind.mockImplementation(() => {return question;});
        spyUpdate.mockImplementation((u, status) => {
            u.status = status;
            return u;
        });
        spyDelete.mockImplementation(() => {return true;});

        const result = await questionService.updateQuestionStatus("Example_Question_Id", "I AM INVALID");

        expect(result).toBeFalsy();
        expect(spyFind).toHaveBeenCalledTimes(1);
        expect(spyUpdate).toHaveBeenCalledTimes(0);
        expect(spyDelete).toHaveBeenCalledTimes(0);
    });

    test("Update question not found", async () => {
        spyFind.mockImplementation(() => {null});
        spyUpdate.mockImplementation((u, status) => {
            u.status = status;
            return u;
        });
        spyDelete.mockImplementation(() => {return true;});

        const result = await questionService.updateQuestionStatus("Example_Question_Id", "approved");

        expect(result).toBeFalsy();
        expect(spyFind).toHaveBeenCalledTimes(1);
        expect(spyUpdate).toHaveBeenCalledTimes(0);
        expect(spyDelete).toHaveBeenCalledTimes(0);
    });

    test("Update not pending question", async () => {
        const question = {
            type: "Multiple Choice",
            difficulty: "easy", 
            question: "What is my name?", 
            correct_answer: "I don't know", 
            incorrect_answers: ["Hunter", "Edwin", "Gwen", "Andrew"],
            userId: "Example_Id",
            questionId: "Example_Question_Id",
            PK: "PK",
            SK: "SK",
            status: "approved",
            createdAt: new Date().toISOString(),
        };
        spyFind.mockImplementation(() => {return question;});
        spyUpdate.mockImplementation((u, status) => {
            u.status = status;
            return u;
        });
        spyDelete.mockImplementation(() => {return true;});

        const result = await questionService.updateQuestionStatus("Example_Question_Id", "approved");

        expect(result).toBeFalsy();
        expect(spyFind).toHaveBeenCalledTimes(1);
        expect(spyUpdate).toHaveBeenCalledTimes(0);
        expect(spyDelete).toHaveBeenCalledTimes(0);
    });

    test("Gets all pending questions success", async() => {
        spyGetAll.mockImplementation(() => {
            return [{
                type: "Multiple Choice",
                difficulty: "easy", 
                question: "What is my name?", 
                correct_answer: "I don't know", 
                incorrect_answers: ["Hunter", "Edwin", "Gwen", "Andrew"],
                userId: "Example_Id",
                questionId: "Example_Question_Id",
                PK: "PK",
                SK: "SK",
                status: "pending",
                createdAt: new Date().toISOString(),
            }];
        });
        const result = await questionService.getAllPendingQuestions();
        
        expect(result[0]).toBeTruthy();
        expect(spyGetAll).toHaveBeenCalledTimes(1);
    });

    test("Get questions by category success", async () => {
        spyGetCategory.mockImplementation(() => {
            return [{
                type: "Multiple Choice",
                difficulty: "easy", 
                question: "What is my name?", 
                correct_answer: "I don't know", 
                incorrect_answers: ["Hunter", "Edwin", "Gwen", "Andrew"],
                userId: "Example_Id",
                questionId: "Example_Question_Id",
                PK: "PK",
                SK: "SK",
                status: "pending",
                createdAt: new Date().toISOString(),
            }];
        });

        const result = await questionService.getQuestionsByCategory("PK", 1);
        
        expect(result[0]).toBeTruthy();
        expect(spyGetCategory).toHaveBeenCalledTimes(1);
    });


    test("Get more questions than in database", async () => {
        spyGetCategory.mockImplementation(() => {
            return [{
                type: "Multiple Choice",
                difficulty: "easy", 
                question: "What is my name?", 
                correct_answer: "I don't know", 
                incorrect_answers: ["Hunter", "Edwin", "Gwen", "Andrew"],
                userId: "Example_Id",
                questionId: "Example_Question_Id",
                PK: "PK",
                SK: "SK",
                status: "pending",
                createdAt: new Date().toISOString(),
            }];
        });

        const result = await questionService.getQuestionsByCategory("PK", 100000);
        
        expect(result.error).toBe(`Number of questions requested is greater than questions stored. Currently, only 1 in the PK category exists.`);
        expect(spyGetCategory).toHaveBeenCalledTimes(1);
    });

});