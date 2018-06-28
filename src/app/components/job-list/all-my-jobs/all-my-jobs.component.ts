import { Component, OnInit } from "@angular/core";
import { data as kdata } from "@progress/kendo-ui/js/kendo.core.js";
import { isDateLessThanToday } from "../../../utils/utils";

@Component({
  selector: "all-my-jobs",
  templateUrl: "./all-my-jobs.component.html"
})
export class AllMyJobsComponent implements OnInit {
  allMyJobsListColumns;
  allMyJobsListModel;
  jobListType = 2;

  ngOnInit() {
    this.allMyJobsListModel = kdata.Model.define({
      fields: {
        rush: { type: "boolean" },
        requestNumber: { type: "number" },
        taskDueDate: { type: "date" },
        proposedReleaseDate: { type: "date" },
        submitted: { type: "date" },
        noOfRound: { type: "number" },
        jobStartDate: { type: "date" },
        finalDropDate: { type: "date" }
      }
    });

    this.allMyJobsListColumns = [
      {
        field: "rush",
        title: "Rush",
        template: (item) => {
          let checked;
          if (item.rush) {
            checked = `<input type="checkbox" checked="${item.rush}" disabled>`;
          } else {
            checked = `<input type="checkbox" disabled>`;
          }
          return checked;
        },
        width: 63,
      },
      {
        field: "requestNumber",
        title: "Request Number",
        template: function (dataItem) { if (dataItem.requestNumber) { return "<a class='gridLink'>" + dataItem.requestNumber + "</a>" } else { return "" } },
        filterable: {
          ui: function (element) {
            element.kendoNumericTextBox({
              format: "n0"
            });
          }
        },
        width: 127,
      },
      {
        field: "jobNumber",
        title: "Job Number",
        template: function (dataItem) { if (dataItem.jobNumber) { return "<a class='gridLink'>" + dataItem.jobNumber + "</a>" } else { return "" } },
        width: 140,
      }, {
        field: "title",
        title: "Job Title",
        encoded: true,
        width: 170,
        template: this.getTemplate.bind(this, "title")
      }, {
        field: "currentTask",
        title: "Current Task",
        template: function (dataItem) { if (dataItem.currentTask) { return "<a class='gridLink'>" + dataItem.currentTask + "</a>" } else { return "" } },
        width: 224,
      }, {
        field: "previousTask",
        title: "Previous Task",
        width: 224,
        template: this.getTemplate.bind(this, "previousTask")
      }, {
        field: "currentActor",
        title: "Current Actor",
        width: 128,
        template: this.getTemplate.bind(this, "currentActor")
      }, {
        field: "taskDueDate",
        title: "Task Due Date",
        width: 110,
        template: this.getTemplate.bind(this, "taskDueDate")
      }, {
        field: "proposedReleaseDate",
        title: "Release Date",
        width: 110,
        template: this.getTemplate.bind(this, "proposedReleaseDate")
      }, {
        field: "magazineName",
        title: "Magazine",
        width: 110,
        template: this.getTemplate.bind(this, "magazineName")
      }, {
        field: "jobTypeName",
        title: "Job Type",
        width: 105,
        template: this.getTemplate.bind(this, "jobTypeName")
      }, {
        field: "sourceName",
        title: "Source",
        width: 115,
        template: this.getTemplate.bind(this, "sourceName")
      }, {
        field: "vehicleName",
        title: "Vehicle",
        width: 105,
        template: this.getTemplate.bind(this, "vehicleName")
      }, {
        field: "jobStatusName",
        title: "Job Status",
        width: 125,
        template: this.getTemplate.bind(this, "jobStatusName")
      },
      {
        field: "submitted",
        title: "Submit Date",
        width: 105,
        template: this.getTemplate.bind(this, "submitted")
      },
      {
        field: "noOfRound",
        title: "Round",
        width: 77,
        filterable: {
          ui: function (element) {
            element.kendoNumericTextBox({
              format: "n0"
            });
          }
        },
        template: this.getTemplate.bind(this, "noOfRound")
      }, {
        field: "previousStatus",
        title: "Previous State",
        width: 127,
        template: this.getTemplate.bind(this, "previousStatus")
      }, {
        field: "previousActor",
        title: "Previous Actor",
        width: 128,
        template: this.getTemplate.bind(this, "previousActor")
      },
      {
        field: "jobStartDate",
        title: "Job Start Date",
        width: 115,
        template: this.getTemplate.bind(this, "jobStartDate")
      },
      {
        field: "finalDropDate",
        title: "Final Drop Date",
        width: 120,
        template: this.getTemplate.bind(this, "finalDropDate")
      },
      {
        field: "marketing",
        title: "Mkt",
        width: 125,
        template: this.getTemplate.bind(this, "marketing")
      },
      {
        field: "timePM",
        title: "Promotion Coordinator",
        width: 125,
        template: this.getTemplate.bind(this, "timePM")
      },
      {
        field: "creative",
        title: "Creative PM",
        width: 130,
        template: this.getTemplate.bind(this, "creative")
      },
      {
        field: "aam",
        title: "AAM",
        width: 130,
        template: this.getTemplate.bind(this, "aam")
      },
      {
        field: "policy",
        title: "Policy",
        width: 130,
        template: this.getTemplate.bind(this, "policy")
      },
      {
        field: "legal",
        title: "Legal",
        width: 130,
        template: this.getTemplate.bind(this, "legal")
      },
      {
        field: "copyAcceptance",
        title: "Copy Acceptance",
        width: 130,
        template: this.getTemplate.bind(this, "copyAcceptance")
      },
      {
        field: "aamTag",
        title: "AAM Type",
        width: 130,
        template: this.getTemplate.bind(this, "aamTag")
      },
    ]
  }

  getTemplate(field, item) {
    let result = item[field] ? item[field] : '';
    if (isDateLessThanToday(item.taskDueDate)) {
      result = `<span style="color:red">${result}</span>`
    }
    return result;
  }

}
