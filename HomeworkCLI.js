"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * File: HomeworkCLI.ts
 * Project: homeworkcli
 * File Created: Saturday, 1st August 2020 9:26:32 pm
 * Author: goEval
 * -----
 * Last Modified: Sunday, 13th September 2020 2:22:07 pm
 * Modified By: goEval
 * -----
 * Copyright (c) 2020 HomeworkCLI
 *
 * MIT License
 *
 * Copyright (c) 2020 HomeworkCLI
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var crypto_js_1 = __importDefault(require("crypto-js"));
var axios_1 = __importDefault(require("axios"));
var querystring_1 = __importDefault(require("querystring"));
var Urls_1 = __importDefault(require("./Urls"));
var postinstance = axios_1.default.create({
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    // proxy: {
    //     host: '127.0.0.1',
    //     port: 8888,
    // },
});
postinstance.interceptors.request.use(function (config) {
    config.data = querystring_1.default.stringify(config.data);
    return config;
}, function (error) {
    throw error;
});
/**
 * HomeworkCLI
 */
var HomeworkCLI;
(function (HomeworkCLI_1) {
    /**
     * HomeworkCLI
     * @class
     */
    var HomeworkCLI = /** @class */ (function () {
        /**
         * construtor
         */
        function HomeworkCLI() {
            this.baseUrl = 'http://www.yixuexiao.cn/';
            this.mac = '03:03:03:03:03:03';
            this.machine = 'HomeworkCLI';
            this.osVersion = '11.0';
            this.userid = '';
            this.token = '';
            this.schoolId = '';
            this.cycoreId = '';
            this.displayName = '';
        }
        /**
         *******************
         * Login functions *
         *******************
         */
        // #region Loginfunctions
        /**
         * login
         * @param {string} username username
         * @param {string} password password
         * @param {boolean} isforce force login
         * @param {number} usertype user type
         * @return {Promise<HomeworkResponse>} response data
         */
        HomeworkCLI.prototype.clientLogin = function (username, password, isforce, usertype) {
            var _this = this;
            if (usertype === void 0) { usertype = 1; }
            return new Promise(function (resolve, reject) {
                _this.post(Urls_1.default.clientLogin, _this.encryptFormData({
                    loginvalue: username,
                    pwd: (function () {
                        var keyHex = crypto_js_1.default.enc.Utf8.parse('jevicjob');
                        return crypto_js_1.default.DES.encrypt(password, keyHex, {
                            iv: keyHex,
                            mode: crypto_js_1.default.mode.CBC,
                            padding: crypto_js_1.default.pad.Pkcs7,
                        }).toString();
                    })(),
                    device: 'mobile',
                    isforce: isforce,
                    usertype: usertype,
                })).then(function (result) {
                    _this.userid = result.data.id;
                    _this.token = result.data.token;
                    _this.cycoreId = result.data.cycoreId;
                    _this.schoolId = result.data.schoolId;
                    _this.displayName = result.data.displayName;
                    resolve(result);
                });
            });
        };
        /**
         * login with given userid and token
         * @param {string} userid userid
         * @param {string} token token
         * @return {HomeworkCLI}
         */
        HomeworkCLI.prototype.offlineLogin = function (userid, token) {
            if (token === void 0) { token = ''; }
            this.userid = userid;
            this.token = token;
            return this;
        };
        // #endregion Loginfunctions
        /**
         ***************
         * Student API *
         ***************
         */
        // #region StudentAPI
        /**
         * coursewareList
         * @param {number} page page
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.coursewareList = function (page) {
            return this.post(Urls_1.default.coursewarelist, this.encryptFormData({
                page: page,
                userid: this.userid,
            }));
        };
        /**
         * mycoursewareList
         * @param {number} page page
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.mycoursewareList = function (page) {
            return this.post(Urls_1.default.mycoursewarelist, this.encryptFormData({
                page: page,
                userid: this.userid,
            }));
        };
        /**
         * getStudentDialogList
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.getStudentDialogList = function () {
            return this.post(Urls_1.default.getStudentDialogList, this.encryptFormData({
                studentid: this.userid,
            }));
        };
        /**
         * sendChatMessage
         * @param {string} reuserid userid of receiver
         * @param {number} type type of content
         * @param {string} content content
         * @param {number} totaltime total time of voice record
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.sendChatMessage = function (reuserid, type, content, totaltime) {
            if (totaltime === void 0) { totaltime = 0; }
            return this.post(Urls_1.default.sendChatMessage, this.encryptFormData({
                totalTime: totaltime,
                type: type,
                userid: this.userid,
                content: content,
                reuserid: reuserid,
            }));
        };
        /**
         * getNoticeList
         * @param {number} page
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.getNoticeList = function (page) {
            return this.post(Urls_1.default.getNoticeList, this.encryptFormData({
                studentid: this.userid,
                page: page,
            }));
        };
        /**
         * getNewMessage
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.getNewMessage = function () {
            return this.post(Urls_1.default.getNewMessage, this.encryptFormData({
                userid: this.userid,
            }));
        };
        /**
         * getUserRank
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.getUserRank = function () {
            return this.post(Urls_1.default.getUserRank, this.encryptFormData({
                userid: this.userid,
            }));
        };
        /**
         * getReadandCommentCount
         * @param {string} noticeId notice id
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.getReadandCommentCount = function (noticeId) {
            return this.post(Urls_1.default.getReadandCommentCount, this.encryptFormData({
                noticeId: noticeId,
            }));
        };
        /**
         * checkModuleStatus
         * @param {number} moduleid module id
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.checkModuleStatus = function (moduleid) {
            return this.post(Urls_1.default.checkModuleStatus, this.encryptFormData({
                userid: this.userid,
                moduleid: moduleid,
            }));
        };
        /**
         * todaySign
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.todaySign = function () {
            return this.post(Urls_1.default.todaySign, this.encryptFormData({
                userid: this.userid,
            }));
        };
        /**
         * operateLesson
         * @param {string} lessonDynamicId lessonDynamicId
         * @param {number} lessonId lessonId
         * @param {number} type type
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.operateLesson = function (lessonDynamicId, lessonId, type) {
            return this.post(this.baseUrl + 'jcservice/lesson/operateLesson', {
                lessonDynamicId: lessonDynamicId,
                lessonId: lessonId,
                safeid: this.userid,
                type: type,
                userId: this.userid,
            });
        };
        /**
         * operateLesson
         * @param {string} lessonDynamicId lessonDynamicId
         * @param {number} lessonId lessonId
         * @param {number} type type
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.operateLessonInfo = function (lessonDynamicId, lessonId) {
            return this.post(this.baseUrl + 'jcservice/lesson/operateLessonInfo', {
                lessonDynamicId: lessonDynamicId,
                lessonId: lessonId,
                safeid: this.userid,
                userId: this.userid,
            });
        };
        /**
         * operateLesson
         * @param {string} lessonDynamicId lessonDynamicId
         * @param {number} lessonId lessonId
         * @param {string} comment comment
         * @param {number} commentType commentType
         * @param {string} commentId commentId
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.addComment = function (lessonDynamicId, lessonId, comment, commentType, commentId) {
            if (commentType === void 0) { commentType = 0; }
            if (commentId === void 0) { commentId = ''; }
            return this.post(this.baseUrl + 'jcservice/lesson/addComment', this.encryptFormData({
                lessonDynamicId: lessonDynamicId,
                lessonId: lessonId,
                safeid: this.userid,
                userId: this.userid,
            }));
        };
        /**
         * setCoursewareInfo
         * @param {string} dynamicId dynamic id
         * @param {number} type type
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.setCoursewareInfo = function (dynamicId, type) {
            return this.post(this.baseUrl + 'jcservice/courseware/oprateShareDynamic', this.encryptFormData({
                dynamicid: dynamicId,
                type: type,
                userid: this.userid,
            }));
        };
        /**
         * setCoursewareInfo
         * @param {string} dynamicId dynamic id
         * @param {number} type type
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.coursewareDynamicData = function (dynamicId) {
            return this.post(this.baseUrl + 'jcservice/courseware/oprateShareDynamicInfo', this.encryptFormData({
                dynamicid: dynamicId,
                userid: this.userid,
            }));
        };
        /**
         * listStuLessonClass
         * @param {number} page page
         * @param {number} pageSize page size
         * @param {string} bankname bankname
         * @param {string} keyword keyword
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.listStuLessonClass = function (page, pageSize, bankname, keyword) {
            if (pageSize === void 0) { pageSize = 10; }
            if (bankname === void 0) { bankname = ''; }
            if (keyword === void 0) { keyword = ''; }
            return this.post(this.baseUrl + 'jcservice/lesson/listStuLessonClass', this.encryptFormData({
                userId: this.userid,
                pageSize: pageSize,
                bankname: bankname,
                keyword: keyword,
                page: page,
            }));
        };
        /**
         * get chat record by student
         * @param {string} teacherid teacher id
         * @param {number} page page
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.getChatRecordByStudent = function (teacherid, page) {
            return this.post(this.baseUrl + '/forum/FSNoticeHome-getMessageByUser', this.encryptFormData({
                studentid: this.userid,
                teacherid: teacherid,
                page: page,
                userid: this.userid,
            }));
        };
        // #endregion StudentAPI
        /**
         ***************
         * Teacher API *
         ***************
         */
        // #region TeacherAPI
        /**
         * shareDoc
         * @param {string} userfor userfor
         * @param {string} classids class ids
         * @param {string} docid doc id
         * @param {string} studentids student ids
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.shareDoc = function (userfor, classids, docid, studentids) {
            return this.post(this.baseUrl + 'jcservice/Courseware/shareDoc', this.encryptFormData({
                userfor: userfor,
                classids: classids,
                docid: docid,
                studentids: studentids,
                userid: this.userid,
            }));
        };
        /**
         * saveDocNew
         * @param {docInfo} docInfo document info
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.saveDocNew = function (docInfo) {
            return this.post(this.baseUrl + 'jcservice/Doc/saveDocNew', this.encryptFormData({
                docInfoJson: JSON.stringify(docInfo),
            }));
        };
        /**
         * create homework
         * @param {workInfo} workInfo
         * @param {number} isareanet
         * @param {string} draftid
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.createHomeWork = function (workInfo, isareanet, draftid) {
            if (isareanet === void 0) { isareanet = 0; }
            if (draftid === void 0) { draftid = ''; }
            return this.post(this.baseUrl + 'jcservice/TeaHomeWork/createHomeWork', this.encryptFormData({
                draftid: draftid,
                workjson: workInfo,
                isareanet: isareanet,
            }));
        };
        /**
         * get chat record by teacher
         * @param {string} studentid student id
         * @param {number} page page
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.getChatRecordByTeacher = function (studentid, page) {
            return this.post(this.baseUrl + '/forum/FSNoticeHome-getMessageByUser', this.encryptFormData({
                teacherid: this.userid,
                studentid: studentid,
                page: page,
                userid: this.userid,
            }));
        };
        /**
         * listTeaShareDynamic
         * @param {number} pagesize pagesize
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.listTeaShareDynamic = function (pagesize) {
            if (pagesize === void 0) { pagesize = 10; }
            return this.post(this.baseUrl + 'jcservice/Courseware/listTeaShareDynamic', this.encryptFormData({
                pagesize: pagesize,
                userid: this.userid,
            }));
        };
        /**
         * getTeaDoc
         * @param {number} pagesize pagesize
         * @param {string} title title
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.getTeaDoc = function (pagesize, title) {
            if (pagesize === void 0) { pagesize = 10; }
            if (title === void 0) { title = ''; }
            return this.post(this.baseUrl + 'jcservice/courseware/getTeaDoc', this.encryptFormData({
                pagesize: pagesize,
                title: title,
                userid: this.userid,
            }));
        };
        /**
         * delDynamicByTea
         * @param {string} shareId shareId
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.delDynamicByTea = function (shareId) {
            return this.post(this.baseUrl + 'jcservice/Courseware/delDynamicByTea', this.encryptFormData({
                shareId: shareId,
            }));
        };
        /**
         * delCourseware
         * @param {string} docid docid
         * @return {Promise<HomeworkResponse>}
         */
        HomeworkCLI.prototype.delCourseware = function (docid) {
            return this.post(this.baseUrl + 'jcservice/Courseware/delCourseware', this.encryptFormData({
                docid: docid,
                userid: this.userid,
            }));
        };
        // #endregion TeacherAPI
        // #region PublicAPI
        /**
         * clear message
         * @param {string} reuserid reuserid
         * @return {Promise<HomeworkResponse>} object
         */
        HomeworkCLI.prototype.clearMessage = function (reuserid) {
            return this.get(Urls_1.default.clearMessage, {
                userid: this.userid,
                reuserid: reuserid,
            });
        };
        /**
         * save data
         * @return {HomeworkData}
         */
        HomeworkCLI.prototype.getData = function () {
            var data = {
                userid: this.userid,
                token: this.token,
                schoolId: this.schoolId,
                cycoreId: this.cycoreId,
                displayName: this.displayName,
            };
            return data;
        };
        /**
         * set base url
         * @param {string} url url
         */
        HomeworkCLI.prototype.setBaseUrl = function (url) {
            this.baseUrl = url;
        };
        /**
         * setmac
         * @param {string} mac mac
         */
        HomeworkCLI.prototype.setMac = function (mac) {
            this.mac = mac;
        };
        /**
         * set machine
         * @param {string} machine machine
         */
        HomeworkCLI.prototype.setMachine = function (machine) {
            this.machine = machine;
        };
        /**
         * set osVersion
         * @param {string} osVersion osVersion
         */
        HomeworkCLI.prototype.setosVersion = function (osVersion) {
            this.osVersion = osVersion;
        };
        // #endregion PublicAPI
        /**
         *********************
         * Private functions *
         *********************
         */
        // #region Privatefunctions
        /**
         * get
         * @param {String} url url
         * @param {Object} data data
         * @return {Promise<Object>} object
         * @private
         */
        HomeworkCLI.prototype.get = function (url, data) {
            return new Promise(function (resolve, reject) {
                axios_1.default.get(url, {
                    params: data,
                }).then(function (response) {
                    console.log(response);
                }).catch(function (err) {
                    reject(new Error(err));
                });
            });
        };
        /**
         * post
         * @private
         * @param {String} url url
         * @param {Object} data data
         * @return {Promise<HomeworkResponse>} object
         */
        HomeworkCLI.prototype.post = function (url, data) {
            return new Promise(function (resolve, reject) {
                postinstance.post(url, data).then(function (value) {
                    if (value.data.code !== undefined && value.data.code === 1) {
                        resolve(value.data);
                    }
                    else {
                        reject(new Error(value.data.msg || value.data.message));
                    }
                }).catch(function (err) {
                    reject(new Error(err));
                });
            });
        };
        /**
         * encrypt form data
         * @private
         * @param {Object} data data
         * @return {Object} encrypted data
         */
        HomeworkCLI.prototype.encryptFormData = function (data) {
            var timestamp = new Date().valueOf();
            var obj = Object.assign(data, {
                safeid: this.userid,
                safetime: timestamp,
                // eslint-disable-next-line new-cap
                key: crypto_js_1.default.MD5(this.userid + timestamp + 'jevictek.homework').toString(),
                mac: this.mac,
                machine: this.machine,
                platform: 'Android',
                osVersion: this.osVersion,
                apiVersion: '1.0',
            });
            if (this.token === '') {
                return obj;
            }
            else {
                return Object.assign(obj, {
                    token: this.token,
                });
            }
        };
        return HomeworkCLI;
    }());
    HomeworkCLI_1.HomeworkCLI = HomeworkCLI;
    // #endregion interfaces
    HomeworkCLI_1.version = '1.0.3';
})(HomeworkCLI || (HomeworkCLI = {}));
exports.default = HomeworkCLI;
