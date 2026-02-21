"use strict";
// Shared enums matching Prisma schema enums
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceType = exports.EventType = exports.CompanyContentType = exports.LibraryType = exports.MeetingType = exports.FollowupStatus = void 0;
var FollowupStatus;
(function (FollowupStatus) {
    FollowupStatus["DRAFT"] = "DRAFT";
    FollowupStatus["PUBLISHED"] = "PUBLISHED";
})(FollowupStatus || (exports.FollowupStatus = FollowupStatus = {}));
var MeetingType;
(function (MeetingType) {
    MeetingType["SALES"] = "SALES";
    MeetingType["PARTNERSHIP"] = "PARTNERSHIP";
    MeetingType["DEMO"] = "DEMO";
    MeetingType["DISCOVERY"] = "DISCOVERY";
    MeetingType["TECHNICAL"] = "TECHNICAL";
    MeetingType["OTHER"] = "OTHER";
})(MeetingType || (exports.MeetingType = MeetingType = {}));
var LibraryType;
(function (LibraryType) {
    LibraryType["ABOUT_US"] = "ABOUT_US";
    LibraryType["VALUE_PROP"] = "VALUE_PROP";
    LibraryType["CASE_STUDY"] = "CASE_STUDY";
    LibraryType["TEAM_BIO"] = "TEAM_BIO";
    LibraryType["PRODUCT"] = "PRODUCT";
    LibraryType["PRICING"] = "PRICING";
})(LibraryType || (exports.LibraryType = LibraryType = {}));
var CompanyContentType;
(function (CompanyContentType) {
    CompanyContentType["HISTORY"] = "HISTORY";
    CompanyContentType["LEADERSHIP"] = "LEADERSHIP";
    CompanyContentType["PRODUCTS"] = "PRODUCTS";
    CompanyContentType["NEWS"] = "NEWS";
    CompanyContentType["NOTES"] = "NOTES";
})(CompanyContentType || (exports.CompanyContentType = CompanyContentType = {}));
var EventType;
(function (EventType) {
    EventType["PAGE_VIEW"] = "PAGE_VIEW";
    EventType["SECTION_VIEW"] = "SECTION_VIEW";
    EventType["FILE_DOWNLOAD"] = "FILE_DOWNLOAD";
    EventType["LINK_CLICK"] = "LINK_CLICK";
    EventType["COPY_EMAIL"] = "COPY_EMAIL";
    EventType["COPY_PHONE"] = "COPY_PHONE";
})(EventType || (exports.EventType = EventType = {}));
var DeviceType;
(function (DeviceType) {
    DeviceType["MOBILE"] = "MOBILE";
    DeviceType["TABLET"] = "TABLET";
    DeviceType["DESKTOP"] = "DESKTOP";
})(DeviceType || (exports.DeviceType = DeviceType = {}));
//# sourceMappingURL=enums.js.map