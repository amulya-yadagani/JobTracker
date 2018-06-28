import { environment } from '../../environments/environment';

const ENDPOINT = `${environment.apiEndpoint}/api`;

const USER_INFO_URL = ENDPOINT + "/User/Roles";
const USER_RECENT_JOBS = ENDPOINT + "/User/RecentJobs";

const PDF_SEARCH_METADATA_URL = ENDPOINT + "/Search/PDFFinal/SearchCriteria";
const PDF_SEARCH_URL = ENDPOINT + "/Search/PDFFinal/Search";
const PDF_SEARCH_REQNO_URL = ENDPOINT + '/Search/PDFFinal/RequestNumber';

const LOG_URL = ENDPOINT + "/log/";//Append error, success, warning, information accordingly
const LOG_ERROR_URL = LOG_URL + "error";
const LOG_SUCCESS_URL = LOG_URL + "success";
const LOG_WARNING_URL = LOG_URL + "warning";
const LOG_INFORMATION_URL = LOG_URL + "information";

const ROLE_ADMIN = "admin";
const ROLE_AAM = "aam";
const ROLE_LEGAL = "legal";
const ROLE_POLICY = "policy";
const ROLE_MARKETING = "marketing";
const ROLE_OPS= "ops";
const ROLE_PHOTO = "photo";
const ROLE_CA= "ca";
const ROLE_TAG_PM= "tag pm";
const ROLE_PROMOTION_COORDINATOR= "promotion coordinator";

const initialAppState = {
  userInfo: null,
  userRoles: []
};

const ORIGINAL = "Original";
const ADDED = "Added";
const MODIFIED = "Modified";
const DELETED = "Deleted";

const MY_TODO_LIST_URL = ENDPOINT + "/JobList/Jobs?jobListType=";
const MY_TODO_LIST_FILTER_COLUMN_URL = ENDPOINT + "/JobList/JobListColumnData?";

const SORT_ORDER_MAP = {"asc":1,"desc":2}
const FILTER_MAP = {"eq":11,"neq":12,"startswith":1,"contains":3,"doesnotcontain":4,"endswith":2,"isempty":5,"isnotempty":6,"gt":7,"gte":8,"lt":9,"lte":10}

// search module
const SEARCH = ENDPOINT + '/Search';
// search - global module
const SEARCH_GLOBAL_URL = SEARCH + '/Global/File';
const SEARCH_GLOBAL_FILEID = SEARCH + '/File';
const SEARCH_GLOBAL_THUMBNAIL = SEARCH + '/Thumbnails';
const SEARCH_GLOBAL_DOWNLOAD = SEARCH + '/Download';
const SEARCH_GLOBAL_FILE_EXISTS = SEARCH + '/FileExist';

const COVER_SEARCH_URL = SEARCH + '/Global/File';
const COVER_SEARCH_THUMBNAIL = SEARCH + '/Thumbnails';
const COVER_SEARCH_METADATA_URL = SEARCH + '/Cover/Magazine?isAllMagazine=true'
const COVER_SEARCH_CIRCMAN_METADATA_URL = SEARCH + '/Cover/CircmanData';
//Popup messages
const RESET_CONFIRM = "Are you sure you want to reset?";

export {
    ENDPOINT,
    initialAppState,
    LOG_ERROR_URL,
    LOG_INFORMATION_URL,
    LOG_SUCCESS_URL,
    USER_INFO_URL,
    USER_RECENT_JOBS,

    ORIGINAL,
    MODIFIED,
    ADDED,
    DELETED,

    RESET_CONFIRM,

    ROLE_ADMIN,
    ROLE_AAM,
    ROLE_CA,
    ROLE_LEGAL,
    ROLE_MARKETING,ROLE_OPS,
    ROLE_PHOTO,
    ROLE_POLICY,
    ROLE_PROMOTION_COORDINATOR,
    ROLE_TAG_PM,

    FILTER_MAP,
    MY_TODO_LIST_URL,
    MY_TODO_LIST_FILTER_COLUMN_URL,
    SORT_ORDER_MAP,

    SEARCH,
    SEARCH_GLOBAL_URL,
    SEARCH_GLOBAL_FILEID,
    SEARCH_GLOBAL_THUMBNAIL,
    SEARCH_GLOBAL_DOWNLOAD,
    SEARCH_GLOBAL_FILE_EXISTS,

    PDF_SEARCH_METADATA_URL,
    PDF_SEARCH_URL,
    PDF_SEARCH_REQNO_URL,

    COVER_SEARCH_URL,
    COVER_SEARCH_THUMBNAIL,
    COVER_SEARCH_METADATA_URL,
    COVER_SEARCH_CIRCMAN_METADATA_URL
}