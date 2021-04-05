/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./getActivityData.ts":
/*!****************************!*\
  !*** ./getActivityData.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function getActivityData(_a) {
    var entities = _a.entities, groupedCommits = _a.groupedCommits, selectedSprintId = _a.selectedSprintId, timeOffset = _a.timeOffset;
    var currentSprint = entities.sprints.get(selectedSprintId);
    var currentCommits = groupedCommits.get(selectedSprintId);
    // const arrayHeatMap = Array(7).fill(Array(24).fill(0));
    var arrayHeatMap = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    currentCommits.forEach(function (commit) {
        var date = new Date(commit.timestamp + timeOffset);
        var hours = date.getHours();
        var day = date.getDay();
        if (day === 0)
            day = 6;
        else
            day -= 1;
        arrayHeatMap[day][hours] += 1;
    });
    var heatMap = {
        mon: arrayHeatMap[0],
        tue: arrayHeatMap[1],
        wed: arrayHeatMap[2],
        thu: arrayHeatMap[3],
        fri: arrayHeatMap[4],
        sat: arrayHeatMap[5],
        sun: arrayHeatMap[6],
    };
    return {
        title: 'Коммиты',
        subtitle: currentSprint.name,
        data: heatMap,
    };
}
exports.default = getActivityData;


/***/ }),

/***/ "./getChartData.ts":
/*!*************************!*\
  !*** ./getChartData.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
function getChartData(_a) {
    var entities = _a.entities, groupedCommits = _a.groupedCommits, selectedSprintId = _a.selectedSprintId, outputUsers = _a.outputUsers;
    var currentSprint = entities.sprints.get(selectedSprintId);
    var sortedSprints = Array.from(entities.sprints.values()).sort(function (_a, _b) {
        var id1 = _a.id;
        var id2 = _b.id;
        return id1 - id2;
    });
    var outputValues = sortedSprints.map(function (sprint) {
        var group = groupedCommits.get(sprint.id);
        var result = {
            title: sprint.id.toString(),
            value: group.length,
        };
        if (sprint.name) {
            result.hint = sprint.name;
        }
        if (sprint.id === selectedSprintId) {
            result.active = true;
        }
        return result;
    });
    return {
        title: 'Коммиты',
        subtitle: currentSprint.name,
        values: outputValues,
        users: outputUsers,
    };
}
exports.default = getChartData;


/***/ }),

/***/ "./getDiagramData.ts":
/*!***************************!*\
  !*** ./getDiagramData.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var util_1 = __webpack_require__(/*! ./util */ "./util.ts");
function getDiagramData(_a) {
    var _b, _c;
    var entities = _a.entities, groupedCommits = _a.groupedCommits, selectedSprintId = _a.selectedSprintId;
    var currentSprint = entities.sprints.get(selectedSprintId);
    var sortedSprints = Array.from(entities.sprints.keys()).sort(function (id1, id2) { return id1 - id2; });
    var currentSprintIndex = sortedSprints.indexOf(selectedSprintId);
    var previousSprintId = sortedSprints[currentSprintIndex - 1];
    var currentCommits = (_b = groupedCommits.get(selectedSprintId)) !== null && _b !== void 0 ? _b : [];
    var sizeGroupedCurrentCommits = util_1.groupCommitsBySize(entities, currentCommits);
    var currentCommitsTotal = sizeGroupedCurrentCommits.map(function (commits) { return commits.length; });
    var previousCommits = (_c = groupedCommits.get(previousSprintId)) !== null && _c !== void 0 ? _c : [];
    var sizeGroupedPreviousCommits = util_1.groupCommitsBySize(entities, previousCommits);
    var previousCommitsTotal = sizeGroupedPreviousCommits.map(function (commits) { return commits.length; });
    var differences = [];
    for (var i = 0; i < 4; ++i) {
        var diff = currentCommitsTotal[i] - previousCommitsTotal[i];
        differences.push(diff);
    }
    var totalDifference = currentCommits.length - previousCommits.length;
    var categories = ['> 1001 строки', '501 — 1000 строк', '101 — 500 строк', '1 — 100 строк'].map(function (title, index) { return ({
        title: title,
        valueText: util_1.getOutput(sizeGroupedCurrentCommits[index].length, ['коммит', 'коммита', 'коммитов']),
        differenceText: util_1.getOutput(differences[index], ['коммит', 'коммита', 'коммитов']),
    }); });
    return {
        title: 'Размер коммитов',
        subtitle: currentSprint.name,
        totalText: util_1.getOutput(currentCommits.length, ['коммит', 'коммита', 'коммитов']),
        differenceText: totalDifference + " \u0441 \u043F\u0440\u043E\u0448\u043B\u043E\u0433\u043E \u0441\u043F\u0440\u0438\u043D\u0442\u0430",
        categories: categories,
    };
}
exports.default = getDiagramData;


/***/ }),

/***/ "./getLeadersData.ts":
/*!***************************!*\
  !*** ./getLeadersData.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var util_1 = __webpack_require__(/*! ./util */ "./util.ts");
function getLeadersData(_a) {
    var entities = _a.entities, groupedCommits = _a.groupedCommits, selectedSprintId = _a.selectedSprintId;
    var currentSprint = entities.sprints.get(selectedSprintId);
    // ids коммитов текущего спринта
    var currentCommits = groupedCommits.get(selectedSprintId);
    var commitsGroupedByUsers = util_1.groupCommitsByUsers(currentCommits);
    var outputUsers = Array.from(commitsGroupedByUsers, function (_a) {
        var _b = __read(_a, 2), userId = _b[0], commits = _b[1];
        var userEntity = entities.users.get(userId);
        return {
            id: userId,
            name: userEntity.name,
            avatar: userEntity.avatar,
            valueText: String(commits.length),
        };
    });
    // сортируем пользователей по количеству коммитов
    // если у пользователей одинаковое количество коммитов, то сортируем по их id
    outputUsers.sort(function (user1, user2) {
        var val1 = Number(user1.valueText);
        var val2 = Number(user2.valueText);
        if (val1 === val2) {
            val1 = user2.id;
            val2 = user1.id;
        }
        return val2 - val1;
    });
    return {
        title: 'Больше всего коммитов',
        subtitle: currentSprint.name,
        emoji: '👑',
        users: outputUsers,
    };
}
exports.default = getLeadersData;


/***/ }),

/***/ "./getVoteData.ts":
/*!************************!*\
  !*** ./getVoteData.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var util_1 = __webpack_require__(/*! ./util */ "./util.ts");
function getVoteData(_a) {
    var entities = _a.entities, selectedSprintId = _a.selectedSprintId;
    var currentSprint = entities.sprints.get(selectedSprintId);
    // комментарии за текущий спринт
    var currentSprintComments = Array.from(entities.comments.values()).filter(function (comment) { return currentSprint.startAt <= comment.createdAt && comment.createdAt <= currentSprint.finishAt; });
    // группирую комментарии по авторам
    var commentsGroupedByUsers = util_1.groupCommentsByUsers(currentSprintComments);
    var outputUsers = Array.from(commentsGroupedByUsers, function (_a) {
        var _b = __read(_a, 2), userId = _b[0], comments = _b[1];
        var userEntity = entities.users.get(userId);
        var value = comments.reduce(function (total, comment) { return total + comment.likes.length; }, 0);
        return {
            id: userId,
            name: userEntity.name,
            avatar: userEntity.avatar,
            valueText: util_1.getOutput(value, ['голос', 'голоса', 'голосов']),
        };
    });
    outputUsers.sort(function (user1, user2) {
        var val1 = Number(user1.valueText.split(' ')[0]);
        var val2 = Number(user2.valueText.split(' ')[0]);
        if (val1 === val2) {
            val1 = user2.id;
            val2 = user1.id;
        }
        return val2 - val1;
    });
    return {
        title: 'Самый 🔎 внимательный разработчик',
        subtitle: currentSprint.name,
        emoji: '🔎',
        users: outputUsers,
    };
}
exports.default = getVoteData;


/***/ }),

/***/ "./prepareData.ts":
/*!************************!*\
  !*** ./prepareData.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareData = void 0;
var processEntities_1 = __importDefault(__webpack_require__(/*! ./processEntities */ "./processEntities.ts"));
var util_1 = __webpack_require__(/*! ./util */ "./util.ts");
var getLeadersData_1 = __importDefault(__webpack_require__(/*! ./getLeadersData */ "./getLeadersData.ts"));
var getVoteData_1 = __importDefault(__webpack_require__(/*! ./getVoteData */ "./getVoteData.ts"));
var getChartData_1 = __importDefault(__webpack_require__(/*! ./getChartData */ "./getChartData.ts"));
var getDiagramData_1 = __importDefault(__webpack_require__(/*! ./getDiagramData */ "./getDiagramData.ts"));
var getActivityData_1 = __importDefault(__webpack_require__(/*! ./getActivityData */ "./getActivityData.ts"));
// const timeOffset = -4 * 60 * 60 * 1000; // для тестов
var timeOffset = 0;
// eslint-disable-next-line import/prefer-default-export
function prepareData(entityArray, _a) {
    var selectedSprintId = _a.sprintId;
    // группирую сущности по типу и привожу их более удобному виду
    // теперь сущности ссылаются на другие сущности только по id
    var entities = processEntities_1.default(entityArray);
    // группирую коммиты по спринтам. На выходе Map<SprintId, Set<CommitId>>
    var groupedCommits = util_1.groupCommitsBySprints(entities);
    var leadersData = getLeadersData_1.default({ entities: entities, groupedCommits: groupedCommits, selectedSprintId: selectedSprintId });
    var voteData = getVoteData_1.default({ entities: entities, selectedSprintId: selectedSprintId });
    // в чарт передаю готовый список лидеров
    var chartData = getChartData_1.default({ entities: entities, groupedCommits: groupedCommits, selectedSprintId: selectedSprintId, outputUsers: leadersData.users });
    var diagramData = getDiagramData_1.default({ entities: entities, groupedCommits: groupedCommits, selectedSprintId: selectedSprintId });
    var activityData = getActivityData_1.default({ entities: entities, groupedCommits: groupedCommits, selectedSprintId: selectedSprintId, timeOffset: timeOffset });
    return [
        {
            alias: 'leaders',
            data: leadersData,
        },
        {
            alias: 'vote',
            data: voteData,
        },
        {
            alias: 'chart',
            data: chartData,
        },
        {
            alias: 'diagram',
            data: diagramData,
        },
        {
            alias: 'activity',
            data: activityData,
        },
    ];
}
exports.prepareData = prepareData;


/***/ }),

/***/ "./processEntities.ts":
/*!****************************!*\
  !*** ./processEntities.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
function processSprint(result, sprint) {
    if (typeof sprint === 'number') {
        return sprint;
    }
    var id = sprint.id;
    if (!result.sprints.has(id)) {
        result.sprints.set(id, __assign({}, sprint));
    }
    return id;
}
function processSummary(result, summary) {
    var _a, _b;
    if (typeof summary === 'number') {
        return summary;
    }
    var id = summary.id;
    var comments = (_b = (_a = summary.comments) === null || _a === void 0 ? void 0 : _a.map(function (comment) { return processComment(result, comment); })) !== null && _b !== void 0 ? _b : [];
    if (!result.summaries.has(id)) {
        result.summaries.set(id, __assign(__assign({}, summary), { comments: comments }));
    }
    return id;
}
function processCommit(result, commit) {
    if (typeof commit === 'string') {
        return commit;
    }
    var id = commit.id;
    var author = processUser(result, commit.author);
    var summaries = commit.summaries.map(function (summary) { return processSummary(result, summary); });
    if (!result.commits.has(id)) {
        result.commits.set(id, __assign(__assign({}, commit), { author: author, summaries: summaries }));
    }
    return id;
}
function processComment(result, comment) {
    if (typeof comment === 'string') {
        return comment;
    }
    var id = comment.id;
    var author = processUser(result, comment.author);
    var likes = comment.likes.map(function (user) { return processUser(result, user); });
    if (!result.comments.has(id)) {
        result.comments.set(id, __assign(__assign({}, comment), { author: author, likes: likes }));
    }
    return id;
}
function processIssue(result, issue) {
    var _a, _b;
    if (typeof issue === 'string') {
        return issue;
    }
    var id = issue.id;
    var comments = (_b = (_a = issue.comments) === null || _a === void 0 ? void 0 : _a.map(function (comment) { return processComment(result, comment); })) !== null && _b !== void 0 ? _b : [];
    var resolvedBy;
    if (issue.resolvedBy) {
        resolvedBy = processUser(result, issue.resolvedBy);
    }
    if (!result.issues.has(id)) {
        result.issues.set(id, __assign(__assign({}, issue), { comments: comments, resolvedBy: resolvedBy }));
    }
    return id;
}
function processUser(result, user) {
    var _a, _b, _c, _d;
    if (typeof user === 'number') {
        return user;
    }
    var id = user.id;
    var friends = user.friends.map(function (friend) { return processUser(result, friend); });
    var comments = (_b = (_a = user.comments) === null || _a === void 0 ? void 0 : _a.map(function (comment) { return processComment(result, comment); })) !== null && _b !== void 0 ? _b : [];
    var commits = (_d = (_c = user.commits) === null || _c === void 0 ? void 0 : _c.map(function (commit) { return processCommit(result, commit); })) !== null && _d !== void 0 ? _d : [];
    if (!result.users.has(id)) {
        result.users.set(id, __assign(__assign({}, user), { friends: friends, comments: comments, commits: commits }));
    }
    return id;
}
function processProject(result, project) {
    if (typeof project === 'string') {
        return project;
    }
    var id = project.id;
    var dependencies = project.dependencies.map(function (dep) { return processProject(result, dep); });
    var issues = project.issues.map(function (issue) { return processIssue(result, issue); });
    var commits = project.commits.map(function (commit) { return processCommit(result, commit); });
    if (!result.projects.has(id)) {
        result.projects.set(id, __assign(__assign({}, project), { dependencies: dependencies, issues: issues, commits: commits }));
    }
    return id;
}
function processEntities(entities) {
    var result = {
        projects: new Map(),
        users: new Map(),
        issues: new Map(),
        comments: new Map(),
        commits: new Map(),
        summaries: new Map(),
        sprints: new Map(),
    };
    entities.forEach(function (entity) {
        if (entity.type === 'Project') {
            processProject(result, entity);
        }
        else if (entity.type === 'User') {
            processUser(result, entity);
        }
        else if (entity.type === 'Issue') {
            processIssue(result, entity);
        }
        else if (entity.type === 'Comment') {
            processComment(result, entity);
        }
        else if (entity.type === 'Commit') {
            processCommit(result, entity);
        }
        else if (entity.type === 'Summary') {
            processSummary(result, entity);
        }
        else if (entity.type === 'Sprint') {
            processSprint(result, entity);
        }
    });
    return result;
}
exports.default = processEntities;


/***/ }),

/***/ "./util.ts":
/*!*****************!*\
  !*** ./util.ts ***!
  \*****************/
/***/ (function(__unused_webpack_module, exports) {


var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOutput = exports.groupCommentsByUsers = exports.groupCommitsByUsers = exports.groupCommitsBySize = exports.groupCommitsBySprints = void 0;
var groupCommitsBySprints = function (entities) {
    var sortedSprints = Array.from(entities.sprints.values()).sort(function (_a, _b) {
        var id1 = _a.id;
        var id2 = _b.id;
        return id1 - id2;
    });
    var sortedCommits = Array.from(entities.commits.values()).sort(function (_a, _b) {
        var timestamp1 = _a.timestamp;
        var timestamp2 = _b.timestamp;
        return timestamp1 - timestamp2;
    });
    return new Map(sortedSprints.map(function (sprint) {
        var startAt = sprint.startAt, finishAt = sprint.finishAt;
        var len = sortedCommits.length;
        var start = sortedCommits.findIndex(function (_a) {
            var timestamp = _a.timestamp;
            return startAt <= timestamp;
        });
        var sprintCommits = [];
        if (start !== -1) {
            var finish = start + 1;
            while (finish < len && sortedCommits[finish].timestamp <= finishAt)
                finish += 1;
            sprintCommits = sortedCommits.slice(start, finish);
            sortedCommits = __spreadArray(__spreadArray([], __read(sortedCommits.slice(0, start))), __read(sortedCommits.slice(finish)));
        }
        return [sprint.id, sprintCommits];
    }));
};
exports.groupCommitsBySprints = groupCommitsBySprints;
var groupCommitsBySize = function (entities, commits) {
    var groups = [[], [], [], []];
    commits.forEach(function (commit) {
        if (commit) {
            var commitSize = commit.summaries.reduce(function (accum, summaryId) {
                var summary = entities.summaries.get(summaryId);
                return summary ? accum + summary.removed + summary.added : accum;
            }, 0);
            if (commitSize <= 100) {
                groups[3].push(commit.id);
            }
            else if (commitSize <= 500) {
                groups[2].push(commit.id);
            }
            else if (commitSize <= 1000) {
                groups[1].push(commit.id);
            }
            else {
                groups[0].push(commit.id);
            }
        }
    });
    return groups;
};
exports.groupCommitsBySize = groupCommitsBySize;
var groupCommitsByUsers = function (commits) {
    var result = new Map();
    commits.forEach(function (commit) {
        var userCommits = result.get(commit.author);
        if (!userCommits) {
            userCommits = [];
            result.set(commit.author, userCommits);
        }
        userCommits.push(commit);
    });
    return result;
};
exports.groupCommitsByUsers = groupCommitsByUsers;
var groupCommentsByUsers = function (comments) {
    var result = new Map();
    comments.forEach(function (comment) {
        var userCommits = result.get(comment.author);
        if (!userCommits) {
            userCommits = [];
            result.set(comment.author, userCommits);
        }
        userCommits.push(comment);
    });
    return result;
};
exports.groupCommentsByUsers = groupCommentsByUsers;
var getOutput = function (number, words) {
    var num = Math.abs(number) % 100;
    if (num > 19) {
        num %= 10;
    }
    switch (num) {
        case 1: {
            return number + " " + words[0];
        }
        case 2:
        case 3:
        case 4: {
            return number + " " + words[1];
        }
        default: {
            return number + " " + words[2];
        }
    }
};
exports.getOutput = getOutput;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./prepareData.ts");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9nZXRBY3Rpdml0eURhdGEudHMiLCJ3ZWJwYWNrOi8vLy4vZ2V0Q2hhcnREYXRhLnRzIiwid2VicGFjazovLy8uL2dldERpYWdyYW1EYXRhLnRzIiwid2VicGFjazovLy8uL2dldExlYWRlcnNEYXRhLnRzIiwid2VicGFjazovLy8uL2dldFZvdGVEYXRhLnRzIiwid2VicGFjazovLy8uL3ByZXBhcmVEYXRhLnRzIiwid2VicGFjazovLy8uL3Byb2Nlc3NFbnRpdGllcy50cyIsIndlYnBhY2s6Ly8vLi91dGlsLnRzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBYTtBQUNiLDhDQUE2QyxDQUFDLGNBQWMsRUFBQztBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7Ozs7Ozs7Ozs7O0FDekNGO0FBQ2IsOENBQTZDLENBQUMsY0FBYyxFQUFDO0FBQzdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7Ozs7Ozs7Ozs7QUMvQkY7QUFDYiw4Q0FBNkMsQ0FBQyxjQUFjLEVBQUM7QUFDN0QsYUFBYSxtQkFBTyxDQUFDLHlCQUFRO0FBQzdCO0FBQ0E7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QUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVQ3RCQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmZ1bmN0aW9uIGdldEFjdGl2aXR5RGF0YShfYSkge1xyXG4gICAgdmFyIGVudGl0aWVzID0gX2EuZW50aXRpZXMsIGdyb3VwZWRDb21taXRzID0gX2EuZ3JvdXBlZENvbW1pdHMsIHNlbGVjdGVkU3ByaW50SWQgPSBfYS5zZWxlY3RlZFNwcmludElkLCB0aW1lT2Zmc2V0ID0gX2EudGltZU9mZnNldDtcclxuICAgIHZhciBjdXJyZW50U3ByaW50ID0gZW50aXRpZXMuc3ByaW50cy5nZXQoc2VsZWN0ZWRTcHJpbnRJZCk7XHJcbiAgICB2YXIgY3VycmVudENvbW1pdHMgPSBncm91cGVkQ29tbWl0cy5nZXQoc2VsZWN0ZWRTcHJpbnRJZCk7XHJcbiAgICAvLyBjb25zdCBhcnJheUhlYXRNYXAgPSBBcnJheSg3KS5maWxsKEFycmF5KDI0KS5maWxsKDApKTtcclxuICAgIHZhciBhcnJheUhlYXRNYXAgPSBbXHJcbiAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgICAgIFswLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwLCAwXSxcclxuICAgICAgICBbMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMCwgMF0sXHJcbiAgICAgICAgWzAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDBdLFxyXG4gICAgXTtcclxuICAgIGN1cnJlbnRDb21taXRzLmZvckVhY2goZnVuY3Rpb24gKGNvbW1pdCkge1xyXG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoY29tbWl0LnRpbWVzdGFtcCArIHRpbWVPZmZzZXQpO1xyXG4gICAgICAgIHZhciBob3VycyA9IGRhdGUuZ2V0SG91cnMoKTtcclxuICAgICAgICB2YXIgZGF5ID0gZGF0ZS5nZXREYXkoKTtcclxuICAgICAgICBpZiAoZGF5ID09PSAwKVxyXG4gICAgICAgICAgICBkYXkgPSA2O1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZGF5IC09IDE7XHJcbiAgICAgICAgYXJyYXlIZWF0TWFwW2RheV1baG91cnNdICs9IDE7XHJcbiAgICB9KTtcclxuICAgIHZhciBoZWF0TWFwID0ge1xyXG4gICAgICAgIG1vbjogYXJyYXlIZWF0TWFwWzBdLFxyXG4gICAgICAgIHR1ZTogYXJyYXlIZWF0TWFwWzFdLFxyXG4gICAgICAgIHdlZDogYXJyYXlIZWF0TWFwWzJdLFxyXG4gICAgICAgIHRodTogYXJyYXlIZWF0TWFwWzNdLFxyXG4gICAgICAgIGZyaTogYXJyYXlIZWF0TWFwWzRdLFxyXG4gICAgICAgIHNhdDogYXJyYXlIZWF0TWFwWzVdLFxyXG4gICAgICAgIHN1bjogYXJyYXlIZWF0TWFwWzZdLFxyXG4gICAgfTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGl0bGU6ICfQmtC+0LzQvNC40YLRiycsXHJcbiAgICAgICAgc3VidGl0bGU6IGN1cnJlbnRTcHJpbnQubmFtZSxcclxuICAgICAgICBkYXRhOiBoZWF0TWFwLFxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBnZXRBY3Rpdml0eURhdGE7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmZ1bmN0aW9uIGdldENoYXJ0RGF0YShfYSkge1xyXG4gICAgdmFyIGVudGl0aWVzID0gX2EuZW50aXRpZXMsIGdyb3VwZWRDb21taXRzID0gX2EuZ3JvdXBlZENvbW1pdHMsIHNlbGVjdGVkU3ByaW50SWQgPSBfYS5zZWxlY3RlZFNwcmludElkLCBvdXRwdXRVc2VycyA9IF9hLm91dHB1dFVzZXJzO1xyXG4gICAgdmFyIGN1cnJlbnRTcHJpbnQgPSBlbnRpdGllcy5zcHJpbnRzLmdldChzZWxlY3RlZFNwcmludElkKTtcclxuICAgIHZhciBzb3J0ZWRTcHJpbnRzID0gQXJyYXkuZnJvbShlbnRpdGllcy5zcHJpbnRzLnZhbHVlcygpKS5zb3J0KGZ1bmN0aW9uIChfYSwgX2IpIHtcclxuICAgICAgICB2YXIgaWQxID0gX2EuaWQ7XHJcbiAgICAgICAgdmFyIGlkMiA9IF9iLmlkO1xyXG4gICAgICAgIHJldHVybiBpZDEgLSBpZDI7XHJcbiAgICB9KTtcclxuICAgIHZhciBvdXRwdXRWYWx1ZXMgPSBzb3J0ZWRTcHJpbnRzLm1hcChmdW5jdGlvbiAoc3ByaW50KSB7XHJcbiAgICAgICAgdmFyIGdyb3VwID0gZ3JvdXBlZENvbW1pdHMuZ2V0KHNwcmludC5pZCk7XHJcbiAgICAgICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICAgICAgdGl0bGU6IHNwcmludC5pZC50b1N0cmluZygpLFxyXG4gICAgICAgICAgICB2YWx1ZTogZ3JvdXAubGVuZ3RoLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKHNwcmludC5uYW1lKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5oaW50ID0gc3ByaW50Lm5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzcHJpbnQuaWQgPT09IHNlbGVjdGVkU3ByaW50SWQpIHtcclxuICAgICAgICAgICAgcmVzdWx0LmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGl0bGU6ICfQmtC+0LzQvNC40YLRiycsXHJcbiAgICAgICAgc3VidGl0bGU6IGN1cnJlbnRTcHJpbnQubmFtZSxcclxuICAgICAgICB2YWx1ZXM6IG91dHB1dFZhbHVlcyxcclxuICAgICAgICB1c2Vyczogb3V0cHV0VXNlcnMsXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGdldENoYXJ0RGF0YTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XHJcbmZ1bmN0aW9uIGdldERpYWdyYW1EYXRhKF9hKSB7XHJcbiAgICB2YXIgX2IsIF9jO1xyXG4gICAgdmFyIGVudGl0aWVzID0gX2EuZW50aXRpZXMsIGdyb3VwZWRDb21taXRzID0gX2EuZ3JvdXBlZENvbW1pdHMsIHNlbGVjdGVkU3ByaW50SWQgPSBfYS5zZWxlY3RlZFNwcmludElkO1xyXG4gICAgdmFyIGN1cnJlbnRTcHJpbnQgPSBlbnRpdGllcy5zcHJpbnRzLmdldChzZWxlY3RlZFNwcmludElkKTtcclxuICAgIHZhciBzb3J0ZWRTcHJpbnRzID0gQXJyYXkuZnJvbShlbnRpdGllcy5zcHJpbnRzLmtleXMoKSkuc29ydChmdW5jdGlvbiAoaWQxLCBpZDIpIHsgcmV0dXJuIGlkMSAtIGlkMjsgfSk7XHJcbiAgICB2YXIgY3VycmVudFNwcmludEluZGV4ID0gc29ydGVkU3ByaW50cy5pbmRleE9mKHNlbGVjdGVkU3ByaW50SWQpO1xyXG4gICAgdmFyIHByZXZpb3VzU3ByaW50SWQgPSBzb3J0ZWRTcHJpbnRzW2N1cnJlbnRTcHJpbnRJbmRleCAtIDFdO1xyXG4gICAgdmFyIGN1cnJlbnRDb21taXRzID0gKF9iID0gZ3JvdXBlZENvbW1pdHMuZ2V0KHNlbGVjdGVkU3ByaW50SWQpKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXTtcclxuICAgIHZhciBzaXplR3JvdXBlZEN1cnJlbnRDb21taXRzID0gdXRpbF8xLmdyb3VwQ29tbWl0c0J5U2l6ZShlbnRpdGllcywgY3VycmVudENvbW1pdHMpO1xyXG4gICAgdmFyIGN1cnJlbnRDb21taXRzVG90YWwgPSBzaXplR3JvdXBlZEN1cnJlbnRDb21taXRzLm1hcChmdW5jdGlvbiAoY29tbWl0cykgeyByZXR1cm4gY29tbWl0cy5sZW5ndGg7IH0pO1xyXG4gICAgdmFyIHByZXZpb3VzQ29tbWl0cyA9IChfYyA9IGdyb3VwZWRDb21taXRzLmdldChwcmV2aW91c1NwcmludElkKSkgIT09IG51bGwgJiYgX2MgIT09IHZvaWQgMCA/IF9jIDogW107XHJcbiAgICB2YXIgc2l6ZUdyb3VwZWRQcmV2aW91c0NvbW1pdHMgPSB1dGlsXzEuZ3JvdXBDb21taXRzQnlTaXplKGVudGl0aWVzLCBwcmV2aW91c0NvbW1pdHMpO1xyXG4gICAgdmFyIHByZXZpb3VzQ29tbWl0c1RvdGFsID0gc2l6ZUdyb3VwZWRQcmV2aW91c0NvbW1pdHMubWFwKGZ1bmN0aW9uIChjb21taXRzKSB7IHJldHVybiBjb21taXRzLmxlbmd0aDsgfSk7XHJcbiAgICB2YXIgZGlmZmVyZW5jZXMgPSBbXTtcclxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNDsgKytpKSB7XHJcbiAgICAgICAgdmFyIGRpZmYgPSBjdXJyZW50Q29tbWl0c1RvdGFsW2ldIC0gcHJldmlvdXNDb21taXRzVG90YWxbaV07XHJcbiAgICAgICAgZGlmZmVyZW5jZXMucHVzaChkaWZmKTtcclxuICAgIH1cclxuICAgIHZhciB0b3RhbERpZmZlcmVuY2UgPSBjdXJyZW50Q29tbWl0cy5sZW5ndGggLSBwcmV2aW91c0NvbW1pdHMubGVuZ3RoO1xyXG4gICAgdmFyIGNhdGVnb3JpZXMgPSBbJz4gMTAwMSDRgdGC0YDQvtC60LgnLCAnNTAxIOKAlCAxMDAwINGB0YLRgNC+0LonLCAnMTAxIOKAlCA1MDAg0YHRgtGA0L7QuicsICcxIOKAlCAxMDAg0YHRgtGA0L7QuiddLm1hcChmdW5jdGlvbiAodGl0bGUsIGluZGV4KSB7IHJldHVybiAoe1xyXG4gICAgICAgIHRpdGxlOiB0aXRsZSxcclxuICAgICAgICB2YWx1ZVRleHQ6IHV0aWxfMS5nZXRPdXRwdXQoc2l6ZUdyb3VwZWRDdXJyZW50Q29tbWl0c1tpbmRleF0ubGVuZ3RoLCBbJ9C60L7QvNC80LjRgicsICfQutC+0LzQvNC40YLQsCcsICfQutC+0LzQvNC40YLQvtCyJ10pLFxyXG4gICAgICAgIGRpZmZlcmVuY2VUZXh0OiB1dGlsXzEuZ2V0T3V0cHV0KGRpZmZlcmVuY2VzW2luZGV4XSwgWyfQutC+0LzQvNC40YInLCAn0LrQvtC80LzQuNGC0LAnLCAn0LrQvtC80LzQuNGC0L7QsiddKSxcclxuICAgIH0pOyB9KTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGl0bGU6ICfQoNCw0LfQvNC10YAg0LrQvtC80LzQuNGC0L7QsicsXHJcbiAgICAgICAgc3VidGl0bGU6IGN1cnJlbnRTcHJpbnQubmFtZSxcclxuICAgICAgICB0b3RhbFRleHQ6IHV0aWxfMS5nZXRPdXRwdXQoY3VycmVudENvbW1pdHMubGVuZ3RoLCBbJ9C60L7QvNC80LjRgicsICfQutC+0LzQvNC40YLQsCcsICfQutC+0LzQvNC40YLQvtCyJ10pLFxyXG4gICAgICAgIGRpZmZlcmVuY2VUZXh0OiB0b3RhbERpZmZlcmVuY2UgKyBcIiBcXHUwNDQxIFxcdTA0M0ZcXHUwNDQwXFx1MDQzRVxcdTA0NDhcXHUwNDNCXFx1MDQzRVxcdTA0MzNcXHUwNDNFIFxcdTA0NDFcXHUwNDNGXFx1MDQ0MFxcdTA0MzhcXHUwNDNEXFx1MDQ0MlxcdTA0MzBcIixcclxuICAgICAgICBjYXRlZ29yaWVzOiBjYXRlZ29yaWVzLFxyXG4gICAgfTtcclxufVxyXG5leHBvcnRzLmRlZmF1bHQgPSBnZXREaWFncmFtRGF0YTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX3JlYWQgPSAodGhpcyAmJiB0aGlzLl9fcmVhZCkgfHwgZnVuY3Rpb24gKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgdXRpbF8xID0gcmVxdWlyZShcIi4vdXRpbFwiKTtcclxuZnVuY3Rpb24gZ2V0TGVhZGVyc0RhdGEoX2EpIHtcclxuICAgIHZhciBlbnRpdGllcyA9IF9hLmVudGl0aWVzLCBncm91cGVkQ29tbWl0cyA9IF9hLmdyb3VwZWRDb21taXRzLCBzZWxlY3RlZFNwcmludElkID0gX2Euc2VsZWN0ZWRTcHJpbnRJZDtcclxuICAgIHZhciBjdXJyZW50U3ByaW50ID0gZW50aXRpZXMuc3ByaW50cy5nZXQoc2VsZWN0ZWRTcHJpbnRJZCk7XHJcbiAgICAvLyBpZHMg0LrQvtC80LzQuNGC0L7QsiDRgtC10LrRg9GJ0LXQs9C+INGB0L/RgNC40L3RgtCwXHJcbiAgICB2YXIgY3VycmVudENvbW1pdHMgPSBncm91cGVkQ29tbWl0cy5nZXQoc2VsZWN0ZWRTcHJpbnRJZCk7XHJcbiAgICB2YXIgY29tbWl0c0dyb3VwZWRCeVVzZXJzID0gdXRpbF8xLmdyb3VwQ29tbWl0c0J5VXNlcnMoY3VycmVudENvbW1pdHMpO1xyXG4gICAgdmFyIG91dHB1dFVzZXJzID0gQXJyYXkuZnJvbShjb21taXRzR3JvdXBlZEJ5VXNlcnMsIGZ1bmN0aW9uIChfYSkge1xyXG4gICAgICAgIHZhciBfYiA9IF9fcmVhZChfYSwgMiksIHVzZXJJZCA9IF9iWzBdLCBjb21taXRzID0gX2JbMV07XHJcbiAgICAgICAgdmFyIHVzZXJFbnRpdHkgPSBlbnRpdGllcy51c2Vycy5nZXQodXNlcklkKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpZDogdXNlcklkLFxyXG4gICAgICAgICAgICBuYW1lOiB1c2VyRW50aXR5Lm5hbWUsXHJcbiAgICAgICAgICAgIGF2YXRhcjogdXNlckVudGl0eS5hdmF0YXIsXHJcbiAgICAgICAgICAgIHZhbHVlVGV4dDogU3RyaW5nKGNvbW1pdHMubGVuZ3RoKSxcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbiAgICAvLyDRgdC+0YDRgtC40YDRg9C10Lwg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C10Lkg0L/QviDQutC+0LvQuNGH0LXRgdGC0LLRgyDQutC+0LzQvNC40YLQvtCyXHJcbiAgICAvLyDQtdGB0LvQuCDRgyDQv9C+0LvRjNC30L7QstCw0YLQtdC70LXQuSDQvtC00LjQvdCw0LrQvtCy0L7QtSDQutC+0LvQuNGH0LXRgdGC0LLQviDQutC+0LzQvNC40YLQvtCyLCDRgtC+INGB0L7RgNGC0LjRgNGD0LXQvCDQv9C+INC40YUgaWRcclxuICAgIG91dHB1dFVzZXJzLnNvcnQoZnVuY3Rpb24gKHVzZXIxLCB1c2VyMikge1xyXG4gICAgICAgIHZhciB2YWwxID0gTnVtYmVyKHVzZXIxLnZhbHVlVGV4dCk7XHJcbiAgICAgICAgdmFyIHZhbDIgPSBOdW1iZXIodXNlcjIudmFsdWVUZXh0KTtcclxuICAgICAgICBpZiAodmFsMSA9PT0gdmFsMikge1xyXG4gICAgICAgICAgICB2YWwxID0gdXNlcjIuaWQ7XHJcbiAgICAgICAgICAgIHZhbDIgPSB1c2VyMS5pZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbDIgLSB2YWwxO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRpdGxlOiAn0JHQvtC70YzRiNC1INCy0YHQtdCz0L4g0LrQvtC80LzQuNGC0L7QsicsXHJcbiAgICAgICAgc3VidGl0bGU6IGN1cnJlbnRTcHJpbnQubmFtZSxcclxuICAgICAgICBlbW9qaTogJ/CfkZEnLFxyXG4gICAgICAgIHVzZXJzOiBvdXRwdXRVc2VycyxcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gZ2V0TGVhZGVyc0RhdGE7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19yZWFkID0gKHRoaXMgJiYgdGhpcy5fX3JlYWQpIHx8IGZ1bmN0aW9uIChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XHJcbmZ1bmN0aW9uIGdldFZvdGVEYXRhKF9hKSB7XHJcbiAgICB2YXIgZW50aXRpZXMgPSBfYS5lbnRpdGllcywgc2VsZWN0ZWRTcHJpbnRJZCA9IF9hLnNlbGVjdGVkU3ByaW50SWQ7XHJcbiAgICB2YXIgY3VycmVudFNwcmludCA9IGVudGl0aWVzLnNwcmludHMuZ2V0KHNlbGVjdGVkU3ByaW50SWQpO1xyXG4gICAgLy8g0LrQvtC80LzQtdC90YLQsNGA0LjQuCDQt9CwINGC0LXQutGD0YnQuNC5INGB0L/RgNC40L3RglxyXG4gICAgdmFyIGN1cnJlbnRTcHJpbnRDb21tZW50cyA9IEFycmF5LmZyb20oZW50aXRpZXMuY29tbWVudHMudmFsdWVzKCkpLmZpbHRlcihmdW5jdGlvbiAoY29tbWVudCkgeyByZXR1cm4gY3VycmVudFNwcmludC5zdGFydEF0IDw9IGNvbW1lbnQuY3JlYXRlZEF0ICYmIGNvbW1lbnQuY3JlYXRlZEF0IDw9IGN1cnJlbnRTcHJpbnQuZmluaXNoQXQ7IH0pO1xyXG4gICAgLy8g0LPRgNGD0L/Qv9C40YDRg9GOINC60L7QvNC80LXQvdGC0LDRgNC40Lgg0L/QviDQsNCy0YLQvtGA0LDQvFxyXG4gICAgdmFyIGNvbW1lbnRzR3JvdXBlZEJ5VXNlcnMgPSB1dGlsXzEuZ3JvdXBDb21tZW50c0J5VXNlcnMoY3VycmVudFNwcmludENvbW1lbnRzKTtcclxuICAgIHZhciBvdXRwdXRVc2VycyA9IEFycmF5LmZyb20oY29tbWVudHNHcm91cGVkQnlVc2VycywgZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgdmFyIF9iID0gX19yZWFkKF9hLCAyKSwgdXNlcklkID0gX2JbMF0sIGNvbW1lbnRzID0gX2JbMV07XHJcbiAgICAgICAgdmFyIHVzZXJFbnRpdHkgPSBlbnRpdGllcy51c2Vycy5nZXQodXNlcklkKTtcclxuICAgICAgICB2YXIgdmFsdWUgPSBjb21tZW50cy5yZWR1Y2UoZnVuY3Rpb24gKHRvdGFsLCBjb21tZW50KSB7IHJldHVybiB0b3RhbCArIGNvbW1lbnQubGlrZXMubGVuZ3RoOyB9LCAwKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBpZDogdXNlcklkLFxyXG4gICAgICAgICAgICBuYW1lOiB1c2VyRW50aXR5Lm5hbWUsXHJcbiAgICAgICAgICAgIGF2YXRhcjogdXNlckVudGl0eS5hdmF0YXIsXHJcbiAgICAgICAgICAgIHZhbHVlVGV4dDogdXRpbF8xLmdldE91dHB1dCh2YWx1ZSwgWyfQs9C+0LvQvtGBJywgJ9Cz0L7Qu9C+0YHQsCcsICfQs9C+0LvQvtGB0L7QsiddKSxcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcbiAgICBvdXRwdXRVc2Vycy5zb3J0KGZ1bmN0aW9uICh1c2VyMSwgdXNlcjIpIHtcclxuICAgICAgICB2YXIgdmFsMSA9IE51bWJlcih1c2VyMS52YWx1ZVRleHQuc3BsaXQoJyAnKVswXSk7XHJcbiAgICAgICAgdmFyIHZhbDIgPSBOdW1iZXIodXNlcjIudmFsdWVUZXh0LnNwbGl0KCcgJylbMF0pO1xyXG4gICAgICAgIGlmICh2YWwxID09PSB2YWwyKSB7XHJcbiAgICAgICAgICAgIHZhbDEgPSB1c2VyMi5pZDtcclxuICAgICAgICAgICAgdmFsMiA9IHVzZXIxLmlkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdmFsMiAtIHZhbDE7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdGl0bGU6ICfQodCw0LzRi9C5IPCflI4g0LLQvdC40LzQsNGC0LXQu9GM0L3Ri9C5INGA0LDQt9GA0LDQsdC+0YLRh9C40LonLFxyXG4gICAgICAgIHN1YnRpdGxlOiBjdXJyZW50U3ByaW50Lm5hbWUsXHJcbiAgICAgICAgZW1vamk6ICfwn5SOJyxcclxuICAgICAgICB1c2Vyczogb3V0cHV0VXNlcnMsXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IGdldFZvdGVEYXRhO1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcclxudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XHJcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcclxufTtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5leHBvcnRzLnByZXBhcmVEYXRhID0gdm9pZCAwO1xyXG52YXIgcHJvY2Vzc0VudGl0aWVzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vcHJvY2Vzc0VudGl0aWVzXCIpKTtcclxudmFyIHV0aWxfMSA9IHJlcXVpcmUoXCIuL3V0aWxcIik7XHJcbnZhciBnZXRMZWFkZXJzRGF0YV8xID0gX19pbXBvcnREZWZhdWx0KHJlcXVpcmUoXCIuL2dldExlYWRlcnNEYXRhXCIpKTtcclxudmFyIGdldFZvdGVEYXRhXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vZ2V0Vm90ZURhdGFcIikpO1xyXG52YXIgZ2V0Q2hhcnREYXRhXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vZ2V0Q2hhcnREYXRhXCIpKTtcclxudmFyIGdldERpYWdyYW1EYXRhXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vZ2V0RGlhZ3JhbURhdGFcIikpO1xyXG52YXIgZ2V0QWN0aXZpdHlEYXRhXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIi4vZ2V0QWN0aXZpdHlEYXRhXCIpKTtcclxuLy8gY29uc3QgdGltZU9mZnNldCA9IC00ICogNjAgKiA2MCAqIDEwMDA7IC8vINC00LvRjyDRgtC10YHRgtC+0LJcclxudmFyIHRpbWVPZmZzZXQgPSAwO1xyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L3ByZWZlci1kZWZhdWx0LWV4cG9ydFxyXG5mdW5jdGlvbiBwcmVwYXJlRGF0YShlbnRpdHlBcnJheSwgX2EpIHtcclxuICAgIHZhciBzZWxlY3RlZFNwcmludElkID0gX2Euc3ByaW50SWQ7XHJcbiAgICAvLyDQs9GA0YPQv9C/0LjRgNGD0Y4g0YHRg9GJ0L3QvtGB0YLQuCDQv9C+INGC0LjQv9GDINC4INC/0YDQuNCy0L7QttGDINC40YUg0LHQvtC70LXQtSDRg9C00L7QsdC90L7QvNGDINCy0LjQtNGDXHJcbiAgICAvLyDRgtC10L/QtdGA0Ywg0YHRg9GJ0L3QvtGB0YLQuCDRgdGB0YvQu9Cw0Y7RgtGB0Y8g0L3QsCDQtNGA0YPQs9C40LUg0YHRg9GJ0L3QvtGB0YLQuCDRgtC+0LvRjNC60L4g0L/QviBpZFxyXG4gICAgdmFyIGVudGl0aWVzID0gcHJvY2Vzc0VudGl0aWVzXzEuZGVmYXVsdChlbnRpdHlBcnJheSk7XHJcbiAgICAvLyDQs9GA0YPQv9C/0LjRgNGD0Y4g0LrQvtC80LzQuNGC0Ysg0L/QviDRgdC/0YDQuNC90YLQsNC8LiDQndCwINCy0YvRhdC+0LTQtSBNYXA8U3ByaW50SWQsIFNldDxDb21taXRJZD4+XHJcbiAgICB2YXIgZ3JvdXBlZENvbW1pdHMgPSB1dGlsXzEuZ3JvdXBDb21taXRzQnlTcHJpbnRzKGVudGl0aWVzKTtcclxuICAgIHZhciBsZWFkZXJzRGF0YSA9IGdldExlYWRlcnNEYXRhXzEuZGVmYXVsdCh7IGVudGl0aWVzOiBlbnRpdGllcywgZ3JvdXBlZENvbW1pdHM6IGdyb3VwZWRDb21taXRzLCBzZWxlY3RlZFNwcmludElkOiBzZWxlY3RlZFNwcmludElkIH0pO1xyXG4gICAgdmFyIHZvdGVEYXRhID0gZ2V0Vm90ZURhdGFfMS5kZWZhdWx0KHsgZW50aXRpZXM6IGVudGl0aWVzLCBzZWxlY3RlZFNwcmludElkOiBzZWxlY3RlZFNwcmludElkIH0pO1xyXG4gICAgLy8g0LIg0YfQsNGA0YIg0L/QtdGA0LXQtNCw0Y4g0LPQvtGC0L7QstGL0Lkg0YHQv9C40YHQvtC6INC70LjQtNC10YDQvtCyXHJcbiAgICB2YXIgY2hhcnREYXRhID0gZ2V0Q2hhcnREYXRhXzEuZGVmYXVsdCh7IGVudGl0aWVzOiBlbnRpdGllcywgZ3JvdXBlZENvbW1pdHM6IGdyb3VwZWRDb21taXRzLCBzZWxlY3RlZFNwcmludElkOiBzZWxlY3RlZFNwcmludElkLCBvdXRwdXRVc2VyczogbGVhZGVyc0RhdGEudXNlcnMgfSk7XHJcbiAgICB2YXIgZGlhZ3JhbURhdGEgPSBnZXREaWFncmFtRGF0YV8xLmRlZmF1bHQoeyBlbnRpdGllczogZW50aXRpZXMsIGdyb3VwZWRDb21taXRzOiBncm91cGVkQ29tbWl0cywgc2VsZWN0ZWRTcHJpbnRJZDogc2VsZWN0ZWRTcHJpbnRJZCB9KTtcclxuICAgIHZhciBhY3Rpdml0eURhdGEgPSBnZXRBY3Rpdml0eURhdGFfMS5kZWZhdWx0KHsgZW50aXRpZXM6IGVudGl0aWVzLCBncm91cGVkQ29tbWl0czogZ3JvdXBlZENvbW1pdHMsIHNlbGVjdGVkU3ByaW50SWQ6IHNlbGVjdGVkU3ByaW50SWQsIHRpbWVPZmZzZXQ6IHRpbWVPZmZzZXQgfSk7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYWxpYXM6ICdsZWFkZXJzJyxcclxuICAgICAgICAgICAgZGF0YTogbGVhZGVyc0RhdGEsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGFsaWFzOiAndm90ZScsXHJcbiAgICAgICAgICAgIGRhdGE6IHZvdGVEYXRhLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhbGlhczogJ2NoYXJ0JyxcclxuICAgICAgICAgICAgZGF0YTogY2hhcnREYXRhLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBhbGlhczogJ2RpYWdyYW0nLFxyXG4gICAgICAgICAgICBkYXRhOiBkaWFncmFtRGF0YSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgYWxpYXM6ICdhY3Rpdml0eScsXHJcbiAgICAgICAgICAgIGRhdGE6IGFjdGl2aXR5RGF0YSxcclxuICAgICAgICB9LFxyXG4gICAgXTtcclxufVxyXG5leHBvcnRzLnByZXBhcmVEYXRhID0gcHJlcGFyZURhdGE7XHJcbiIsIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XHJcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xyXG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXHJcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn07XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZnVuY3Rpb24gcHJvY2Vzc1NwcmludChyZXN1bHQsIHNwcmludCkge1xyXG4gICAgaWYgKHR5cGVvZiBzcHJpbnQgPT09ICdudW1iZXInKSB7XHJcbiAgICAgICAgcmV0dXJuIHNwcmludDtcclxuICAgIH1cclxuICAgIHZhciBpZCA9IHNwcmludC5pZDtcclxuICAgIGlmICghcmVzdWx0LnNwcmludHMuaGFzKGlkKSkge1xyXG4gICAgICAgIHJlc3VsdC5zcHJpbnRzLnNldChpZCwgX19hc3NpZ24oe30sIHNwcmludCkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGlkO1xyXG59XHJcbmZ1bmN0aW9uIHByb2Nlc3NTdW1tYXJ5KHJlc3VsdCwgc3VtbWFyeSkge1xyXG4gICAgdmFyIF9hLCBfYjtcclxuICAgIGlmICh0eXBlb2Ygc3VtbWFyeSA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICByZXR1cm4gc3VtbWFyeTtcclxuICAgIH1cclxuICAgIHZhciBpZCA9IHN1bW1hcnkuaWQ7XHJcbiAgICB2YXIgY29tbWVudHMgPSAoX2IgPSAoX2EgPSBzdW1tYXJ5LmNvbW1lbnRzKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EubWFwKGZ1bmN0aW9uIChjb21tZW50KSB7IHJldHVybiBwcm9jZXNzQ29tbWVudChyZXN1bHQsIGNvbW1lbnQpOyB9KSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogW107XHJcbiAgICBpZiAoIXJlc3VsdC5zdW1tYXJpZXMuaGFzKGlkKSkge1xyXG4gICAgICAgIHJlc3VsdC5zdW1tYXJpZXMuc2V0KGlkLCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgc3VtbWFyeSksIHsgY29tbWVudHM6IGNvbW1lbnRzIH0pKTtcclxuICAgIH1cclxuICAgIHJldHVybiBpZDtcclxufVxyXG5mdW5jdGlvbiBwcm9jZXNzQ29tbWl0KHJlc3VsdCwgY29tbWl0KSB7XHJcbiAgICBpZiAodHlwZW9mIGNvbW1pdCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXR1cm4gY29tbWl0O1xyXG4gICAgfVxyXG4gICAgdmFyIGlkID0gY29tbWl0LmlkO1xyXG4gICAgdmFyIGF1dGhvciA9IHByb2Nlc3NVc2VyKHJlc3VsdCwgY29tbWl0LmF1dGhvcik7XHJcbiAgICB2YXIgc3VtbWFyaWVzID0gY29tbWl0LnN1bW1hcmllcy5tYXAoZnVuY3Rpb24gKHN1bW1hcnkpIHsgcmV0dXJuIHByb2Nlc3NTdW1tYXJ5KHJlc3VsdCwgc3VtbWFyeSk7IH0pO1xyXG4gICAgaWYgKCFyZXN1bHQuY29tbWl0cy5oYXMoaWQpKSB7XHJcbiAgICAgICAgcmVzdWx0LmNvbW1pdHMuc2V0KGlkLCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgY29tbWl0KSwgeyBhdXRob3I6IGF1dGhvciwgc3VtbWFyaWVzOiBzdW1tYXJpZXMgfSkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGlkO1xyXG59XHJcbmZ1bmN0aW9uIHByb2Nlc3NDb21tZW50KHJlc3VsdCwgY29tbWVudCkge1xyXG4gICAgaWYgKHR5cGVvZiBjb21tZW50ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJldHVybiBjb21tZW50O1xyXG4gICAgfVxyXG4gICAgdmFyIGlkID0gY29tbWVudC5pZDtcclxuICAgIHZhciBhdXRob3IgPSBwcm9jZXNzVXNlcihyZXN1bHQsIGNvbW1lbnQuYXV0aG9yKTtcclxuICAgIHZhciBsaWtlcyA9IGNvbW1lbnQubGlrZXMubWFwKGZ1bmN0aW9uICh1c2VyKSB7IHJldHVybiBwcm9jZXNzVXNlcihyZXN1bHQsIHVzZXIpOyB9KTtcclxuICAgIGlmICghcmVzdWx0LmNvbW1lbnRzLmhhcyhpZCkpIHtcclxuICAgICAgICByZXN1bHQuY29tbWVudHMuc2V0KGlkLCBfX2Fzc2lnbihfX2Fzc2lnbih7fSwgY29tbWVudCksIHsgYXV0aG9yOiBhdXRob3IsIGxpa2VzOiBsaWtlcyB9KSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaWQ7XHJcbn1cclxuZnVuY3Rpb24gcHJvY2Vzc0lzc3VlKHJlc3VsdCwgaXNzdWUpIHtcclxuICAgIHZhciBfYSwgX2I7XHJcbiAgICBpZiAodHlwZW9mIGlzc3VlID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJldHVybiBpc3N1ZTtcclxuICAgIH1cclxuICAgIHZhciBpZCA9IGlzc3VlLmlkO1xyXG4gICAgdmFyIGNvbW1lbnRzID0gKF9iID0gKF9hID0gaXNzdWUuY29tbWVudHMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tYXAoZnVuY3Rpb24gKGNvbW1lbnQpIHsgcmV0dXJuIHByb2Nlc3NDb21tZW50KHJlc3VsdCwgY29tbWVudCk7IH0pKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXTtcclxuICAgIHZhciByZXNvbHZlZEJ5O1xyXG4gICAgaWYgKGlzc3VlLnJlc29sdmVkQnkpIHtcclxuICAgICAgICByZXNvbHZlZEJ5ID0gcHJvY2Vzc1VzZXIocmVzdWx0LCBpc3N1ZS5yZXNvbHZlZEJ5KTtcclxuICAgIH1cclxuICAgIGlmICghcmVzdWx0Lmlzc3Vlcy5oYXMoaWQpKSB7XHJcbiAgICAgICAgcmVzdWx0Lmlzc3Vlcy5zZXQoaWQsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBpc3N1ZSksIHsgY29tbWVudHM6IGNvbW1lbnRzLCByZXNvbHZlZEJ5OiByZXNvbHZlZEJ5IH0pKTtcclxuICAgIH1cclxuICAgIHJldHVybiBpZDtcclxufVxyXG5mdW5jdGlvbiBwcm9jZXNzVXNlcihyZXN1bHQsIHVzZXIpIHtcclxuICAgIHZhciBfYSwgX2IsIF9jLCBfZDtcclxuICAgIGlmICh0eXBlb2YgdXNlciA9PT0gJ251bWJlcicpIHtcclxuICAgICAgICByZXR1cm4gdXNlcjtcclxuICAgIH1cclxuICAgIHZhciBpZCA9IHVzZXIuaWQ7XHJcbiAgICB2YXIgZnJpZW5kcyA9IHVzZXIuZnJpZW5kcy5tYXAoZnVuY3Rpb24gKGZyaWVuZCkgeyByZXR1cm4gcHJvY2Vzc1VzZXIocmVzdWx0LCBmcmllbmQpOyB9KTtcclxuICAgIHZhciBjb21tZW50cyA9IChfYiA9IChfYSA9IHVzZXIuY29tbWVudHMpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tYXAoZnVuY3Rpb24gKGNvbW1lbnQpIHsgcmV0dXJuIHByb2Nlc3NDb21tZW50KHJlc3VsdCwgY29tbWVudCk7IH0pKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBbXTtcclxuICAgIHZhciBjb21taXRzID0gKF9kID0gKF9jID0gdXNlci5jb21taXRzKSA9PT0gbnVsbCB8fCBfYyA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2MubWFwKGZ1bmN0aW9uIChjb21taXQpIHsgcmV0dXJuIHByb2Nlc3NDb21taXQocmVzdWx0LCBjb21taXQpOyB9KSkgIT09IG51bGwgJiYgX2QgIT09IHZvaWQgMCA/IF9kIDogW107XHJcbiAgICBpZiAoIXJlc3VsdC51c2Vycy5oYXMoaWQpKSB7XHJcbiAgICAgICAgcmVzdWx0LnVzZXJzLnNldChpZCwgX19hc3NpZ24oX19hc3NpZ24oe30sIHVzZXIpLCB7IGZyaWVuZHM6IGZyaWVuZHMsIGNvbW1lbnRzOiBjb21tZW50cywgY29tbWl0czogY29tbWl0cyB9KSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaWQ7XHJcbn1cclxuZnVuY3Rpb24gcHJvY2Vzc1Byb2plY3QocmVzdWx0LCBwcm9qZWN0KSB7XHJcbiAgICBpZiAodHlwZW9mIHByb2plY3QgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcmV0dXJuIHByb2plY3Q7XHJcbiAgICB9XHJcbiAgICB2YXIgaWQgPSBwcm9qZWN0LmlkO1xyXG4gICAgdmFyIGRlcGVuZGVuY2llcyA9IHByb2plY3QuZGVwZW5kZW5jaWVzLm1hcChmdW5jdGlvbiAoZGVwKSB7IHJldHVybiBwcm9jZXNzUHJvamVjdChyZXN1bHQsIGRlcCk7IH0pO1xyXG4gICAgdmFyIGlzc3VlcyA9IHByb2plY3QuaXNzdWVzLm1hcChmdW5jdGlvbiAoaXNzdWUpIHsgcmV0dXJuIHByb2Nlc3NJc3N1ZShyZXN1bHQsIGlzc3VlKTsgfSk7XHJcbiAgICB2YXIgY29tbWl0cyA9IHByb2plY3QuY29tbWl0cy5tYXAoZnVuY3Rpb24gKGNvbW1pdCkgeyByZXR1cm4gcHJvY2Vzc0NvbW1pdChyZXN1bHQsIGNvbW1pdCk7IH0pO1xyXG4gICAgaWYgKCFyZXN1bHQucHJvamVjdHMuaGFzKGlkKSkge1xyXG4gICAgICAgIHJlc3VsdC5wcm9qZWN0cy5zZXQoaWQsIF9fYXNzaWduKF9fYXNzaWduKHt9LCBwcm9qZWN0KSwgeyBkZXBlbmRlbmNpZXM6IGRlcGVuZGVuY2llcywgaXNzdWVzOiBpc3N1ZXMsIGNvbW1pdHM6IGNvbW1pdHMgfSkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGlkO1xyXG59XHJcbmZ1bmN0aW9uIHByb2Nlc3NFbnRpdGllcyhlbnRpdGllcykge1xyXG4gICAgdmFyIHJlc3VsdCA9IHtcclxuICAgICAgICBwcm9qZWN0czogbmV3IE1hcCgpLFxyXG4gICAgICAgIHVzZXJzOiBuZXcgTWFwKCksXHJcbiAgICAgICAgaXNzdWVzOiBuZXcgTWFwKCksXHJcbiAgICAgICAgY29tbWVudHM6IG5ldyBNYXAoKSxcclxuICAgICAgICBjb21taXRzOiBuZXcgTWFwKCksXHJcbiAgICAgICAgc3VtbWFyaWVzOiBuZXcgTWFwKCksXHJcbiAgICAgICAgc3ByaW50czogbmV3IE1hcCgpLFxyXG4gICAgfTtcclxuICAgIGVudGl0aWVzLmZvckVhY2goZnVuY3Rpb24gKGVudGl0eSkge1xyXG4gICAgICAgIGlmIChlbnRpdHkudHlwZSA9PT0gJ1Byb2plY3QnKSB7XHJcbiAgICAgICAgICAgIHByb2Nlc3NQcm9qZWN0KHJlc3VsdCwgZW50aXR5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZW50aXR5LnR5cGUgPT09ICdVc2VyJykge1xyXG4gICAgICAgICAgICBwcm9jZXNzVXNlcihyZXN1bHQsIGVudGl0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGVudGl0eS50eXBlID09PSAnSXNzdWUnKSB7XHJcbiAgICAgICAgICAgIHByb2Nlc3NJc3N1ZShyZXN1bHQsIGVudGl0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGVudGl0eS50eXBlID09PSAnQ29tbWVudCcpIHtcclxuICAgICAgICAgICAgcHJvY2Vzc0NvbW1lbnQocmVzdWx0LCBlbnRpdHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChlbnRpdHkudHlwZSA9PT0gJ0NvbW1pdCcpIHtcclxuICAgICAgICAgICAgcHJvY2Vzc0NvbW1pdChyZXN1bHQsIGVudGl0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGVudGl0eS50eXBlID09PSAnU3VtbWFyeScpIHtcclxuICAgICAgICAgICAgcHJvY2Vzc1N1bW1hcnkocmVzdWx0LCBlbnRpdHkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChlbnRpdHkudHlwZSA9PT0gJ1NwcmludCcpIHtcclxuICAgICAgICAgICAgcHJvY2Vzc1NwcmludChyZXN1bHQsIGVudGl0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IHByb2Nlc3NFbnRpdGllcztcclxuIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbnZhciBfX3JlYWQgPSAodGhpcyAmJiB0aGlzLl9fcmVhZCkgfHwgZnVuY3Rpb24gKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufTtcclxudmFyIF9fc3ByZWFkQXJyYXkgPSAodGhpcyAmJiB0aGlzLl9fc3ByZWFkQXJyYXkpIHx8IGZ1bmN0aW9uICh0bywgZnJvbSkge1xyXG4gICAgZm9yICh2YXIgaSA9IDAsIGlsID0gZnJvbS5sZW5ndGgsIGogPSB0by5sZW5ndGg7IGkgPCBpbDsgaSsrLCBqKyspXHJcbiAgICAgICAgdG9bal0gPSBmcm9tW2ldO1xyXG4gICAgcmV0dXJuIHRvO1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmV4cG9ydHMuZ2V0T3V0cHV0ID0gZXhwb3J0cy5ncm91cENvbW1lbnRzQnlVc2VycyA9IGV4cG9ydHMuZ3JvdXBDb21taXRzQnlVc2VycyA9IGV4cG9ydHMuZ3JvdXBDb21taXRzQnlTaXplID0gZXhwb3J0cy5ncm91cENvbW1pdHNCeVNwcmludHMgPSB2b2lkIDA7XHJcbnZhciBncm91cENvbW1pdHNCeVNwcmludHMgPSBmdW5jdGlvbiAoZW50aXRpZXMpIHtcclxuICAgIHZhciBzb3J0ZWRTcHJpbnRzID0gQXJyYXkuZnJvbShlbnRpdGllcy5zcHJpbnRzLnZhbHVlcygpKS5zb3J0KGZ1bmN0aW9uIChfYSwgX2IpIHtcclxuICAgICAgICB2YXIgaWQxID0gX2EuaWQ7XHJcbiAgICAgICAgdmFyIGlkMiA9IF9iLmlkO1xyXG4gICAgICAgIHJldHVybiBpZDEgLSBpZDI7XHJcbiAgICB9KTtcclxuICAgIHZhciBzb3J0ZWRDb21taXRzID0gQXJyYXkuZnJvbShlbnRpdGllcy5jb21taXRzLnZhbHVlcygpKS5zb3J0KGZ1bmN0aW9uIChfYSwgX2IpIHtcclxuICAgICAgICB2YXIgdGltZXN0YW1wMSA9IF9hLnRpbWVzdGFtcDtcclxuICAgICAgICB2YXIgdGltZXN0YW1wMiA9IF9iLnRpbWVzdGFtcDtcclxuICAgICAgICByZXR1cm4gdGltZXN0YW1wMSAtIHRpbWVzdGFtcDI7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBuZXcgTWFwKHNvcnRlZFNwcmludHMubWFwKGZ1bmN0aW9uIChzcHJpbnQpIHtcclxuICAgICAgICB2YXIgc3RhcnRBdCA9IHNwcmludC5zdGFydEF0LCBmaW5pc2hBdCA9IHNwcmludC5maW5pc2hBdDtcclxuICAgICAgICB2YXIgbGVuID0gc29ydGVkQ29tbWl0cy5sZW5ndGg7XHJcbiAgICAgICAgdmFyIHN0YXJ0ID0gc29ydGVkQ29tbWl0cy5maW5kSW5kZXgoZnVuY3Rpb24gKF9hKSB7XHJcbiAgICAgICAgICAgIHZhciB0aW1lc3RhbXAgPSBfYS50aW1lc3RhbXA7XHJcbiAgICAgICAgICAgIHJldHVybiBzdGFydEF0IDw9IHRpbWVzdGFtcDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB2YXIgc3ByaW50Q29tbWl0cyA9IFtdO1xyXG4gICAgICAgIGlmIChzdGFydCAhPT0gLTEpIHtcclxuICAgICAgICAgICAgdmFyIGZpbmlzaCA9IHN0YXJ0ICsgMTtcclxuICAgICAgICAgICAgd2hpbGUgKGZpbmlzaCA8IGxlbiAmJiBzb3J0ZWRDb21taXRzW2ZpbmlzaF0udGltZXN0YW1wIDw9IGZpbmlzaEF0KVxyXG4gICAgICAgICAgICAgICAgZmluaXNoICs9IDE7XHJcbiAgICAgICAgICAgIHNwcmludENvbW1pdHMgPSBzb3J0ZWRDb21taXRzLnNsaWNlKHN0YXJ0LCBmaW5pc2gpO1xyXG4gICAgICAgICAgICBzb3J0ZWRDb21taXRzID0gX19zcHJlYWRBcnJheShfX3NwcmVhZEFycmF5KFtdLCBfX3JlYWQoc29ydGVkQ29tbWl0cy5zbGljZSgwLCBzdGFydCkpKSwgX19yZWFkKHNvcnRlZENvbW1pdHMuc2xpY2UoZmluaXNoKSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gW3NwcmludC5pZCwgc3ByaW50Q29tbWl0c107XHJcbiAgICB9KSk7XHJcbn07XHJcbmV4cG9ydHMuZ3JvdXBDb21taXRzQnlTcHJpbnRzID0gZ3JvdXBDb21taXRzQnlTcHJpbnRzO1xyXG52YXIgZ3JvdXBDb21taXRzQnlTaXplID0gZnVuY3Rpb24gKGVudGl0aWVzLCBjb21taXRzKSB7XHJcbiAgICB2YXIgZ3JvdXBzID0gW1tdLCBbXSwgW10sIFtdXTtcclxuICAgIGNvbW1pdHMuZm9yRWFjaChmdW5jdGlvbiAoY29tbWl0KSB7XHJcbiAgICAgICAgaWYgKGNvbW1pdCkge1xyXG4gICAgICAgICAgICB2YXIgY29tbWl0U2l6ZSA9IGNvbW1pdC5zdW1tYXJpZXMucmVkdWNlKGZ1bmN0aW9uIChhY2N1bSwgc3VtbWFyeUlkKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3VtbWFyeSA9IGVudGl0aWVzLnN1bW1hcmllcy5nZXQoc3VtbWFyeUlkKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdW1tYXJ5ID8gYWNjdW0gKyBzdW1tYXJ5LnJlbW92ZWQgKyBzdW1tYXJ5LmFkZGVkIDogYWNjdW07XHJcbiAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICBpZiAoY29tbWl0U2l6ZSA8PSAxMDApIHtcclxuICAgICAgICAgICAgICAgIGdyb3Vwc1szXS5wdXNoKGNvbW1pdC5pZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWl0U2l6ZSA8PSA1MDApIHtcclxuICAgICAgICAgICAgICAgIGdyb3Vwc1syXS5wdXNoKGNvbW1pdC5pZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWl0U2l6ZSA8PSAxMDAwKSB7XHJcbiAgICAgICAgICAgICAgICBncm91cHNbMV0ucHVzaChjb21taXQuaWQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXBzWzBdLnB1c2goY29tbWl0LmlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGdyb3VwcztcclxufTtcclxuZXhwb3J0cy5ncm91cENvbW1pdHNCeVNpemUgPSBncm91cENvbW1pdHNCeVNpemU7XHJcbnZhciBncm91cENvbW1pdHNCeVVzZXJzID0gZnVuY3Rpb24gKGNvbW1pdHMpIHtcclxuICAgIHZhciByZXN1bHQgPSBuZXcgTWFwKCk7XHJcbiAgICBjb21taXRzLmZvckVhY2goZnVuY3Rpb24gKGNvbW1pdCkge1xyXG4gICAgICAgIHZhciB1c2VyQ29tbWl0cyA9IHJlc3VsdC5nZXQoY29tbWl0LmF1dGhvcik7XHJcbiAgICAgICAgaWYgKCF1c2VyQ29tbWl0cykge1xyXG4gICAgICAgICAgICB1c2VyQ29tbWl0cyA9IFtdO1xyXG4gICAgICAgICAgICByZXN1bHQuc2V0KGNvbW1pdC5hdXRob3IsIHVzZXJDb21taXRzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdXNlckNvbW1pdHMucHVzaChjb21taXQpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG5leHBvcnRzLmdyb3VwQ29tbWl0c0J5VXNlcnMgPSBncm91cENvbW1pdHNCeVVzZXJzO1xyXG52YXIgZ3JvdXBDb21tZW50c0J5VXNlcnMgPSBmdW5jdGlvbiAoY29tbWVudHMpIHtcclxuICAgIHZhciByZXN1bHQgPSBuZXcgTWFwKCk7XHJcbiAgICBjb21tZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChjb21tZW50KSB7XHJcbiAgICAgICAgdmFyIHVzZXJDb21taXRzID0gcmVzdWx0LmdldChjb21tZW50LmF1dGhvcik7XHJcbiAgICAgICAgaWYgKCF1c2VyQ29tbWl0cykge1xyXG4gICAgICAgICAgICB1c2VyQ29tbWl0cyA9IFtdO1xyXG4gICAgICAgICAgICByZXN1bHQuc2V0KGNvbW1lbnQuYXV0aG9yLCB1c2VyQ29tbWl0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHVzZXJDb21taXRzLnB1c2goY29tbWVudCk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn07XHJcbmV4cG9ydHMuZ3JvdXBDb21tZW50c0J5VXNlcnMgPSBncm91cENvbW1lbnRzQnlVc2VycztcclxudmFyIGdldE91dHB1dCA9IGZ1bmN0aW9uIChudW1iZXIsIHdvcmRzKSB7XHJcbiAgICB2YXIgbnVtID0gTWF0aC5hYnMobnVtYmVyKSAlIDEwMDtcclxuICAgIGlmIChudW0gPiAxOSkge1xyXG4gICAgICAgIG51bSAlPSAxMDtcclxuICAgIH1cclxuICAgIHN3aXRjaCAobnVtKSB7XHJcbiAgICAgICAgY2FzZSAxOiB7XHJcbiAgICAgICAgICAgIHJldHVybiBudW1iZXIgKyBcIiBcIiArIHdvcmRzWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgIGNhc2UgNDoge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVtYmVyICsgXCIgXCIgKyB3b3Jkc1sxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVtYmVyICsgXCIgXCIgKyB3b3Jkc1syXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbmV4cG9ydHMuZ2V0T3V0cHV0ID0gZ2V0T3V0cHV0O1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9wcmVwYXJlRGF0YS50c1wiKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=