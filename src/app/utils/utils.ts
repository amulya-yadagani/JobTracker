import { LOG_TO_SERVER } from "../state/app-state.service";

/**
 * This function creates an action to log error in server.
 * This function is used in service classes where http requests are made
 * @param err - Response
 * @param methodName - name of the method in *.service.ts class where http error occurred
 * @param fileName - filename where error occurred
 */
export function getErrorAction(err:any,methodName,fileName) {
  return {
    type: LOG_TO_SERVER,
    payload: {
      data: {
        ...err,
        message: "Http error",
        fileName: fileName,
        stack: methodName
      }
    }
  }
}

export function getErrorMessage(err) {
  let msg = "";

  if(err) {
    if(err._body) {
      let resp = JSON.parse(err._body);

      if(resp && resp.isError) {
        let model = JSON.parse(resp.model);
        let acDetailsMsg = model.AccountDetail;
        let impersonationMsg = model.ImpersonationDetails;
        let appResourceMsg = model.ApplicationResource;

        if(resp.errorMessage) {
          msg = resp.errorMessage;
        }
        else {
          if(acDetailsMsg) {
            msg += acDetailsMsg + "\n";
          }
          if(impersonationMsg) {
            msg += impersonationMsg + "\n";
          }
          if(appResourceMsg) {
            msg += appResourceMsg;
          }
        }
      }
    }
  }

  return msg;
}

export function formatJobListDates(items) {
  if(!items) {
    return;
  }

  if(items.length) {
    items.forEach(item => {
      item.taskDueDate = item.taskDueDate ? new Date(item.taskDueDate).toLocaleDateString() : "";
      item.proposedReleaseDate = item.proposedReleaseDate ? new Date(item.proposedReleaseDate).toLocaleDateString() : "";
      item.submitted = item.submitted ? new Date(item.submitted).toLocaleDateString() : "";
      item.jobStartDate = item.jobStartDate ? new Date(item.jobStartDate).toLocaleDateString() : "";
      item.finalDropDate = item.finalDropDate ? new Date(item.finalDropDate).toLocaleDateString() : "";
    });
  }
}

/**
 * Checks if the passed date is less than today. Today's time is set to 00:00:00 when comparing
 * @param value date with string format -> mm/dd/yyyy
 */
export function isDateLessThanToday(value) {
  if(!value) {
    return false;
  }

  let today = new Date();
  today.setHours(0,0,0,0);
  let date  = new Date(value);

  return date.getTime() < today.getTime();
}

// search TODO be reviewed...
export function removeFileExt(value) {
  if (!value) {
    return false;
  }
  return value.slice(0, value.lastIndexOf('.'));
}
