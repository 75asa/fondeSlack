import { WebAPICallResult } from "@slack/web-api";

// slack api user profile result
interface userResult {
  profile: object;
  title: string;
  real_name: string;
  display_name: string;
  fields: object;
  status_text: string;
  first_name: string;
  last_name: string;
}

// Firestore?document???
interface userInfo {
  title: string;
  displayName: string[];
  realName: string[];
  field: string[];
  arrayData: string[];
}

class Profile {
  private userResult: userResult;

  public constructor(apiResult: WebAPICallResult) {
    this.userResult = apiResult.profile as userResult;
  }
  private splitWords = (data: string): string[] => {
    if (!data) return [];

    const specialChar = /\/||／/;
    const result = data
      .split(/\s+/)
      .filter(item => item.replace(specialChar, ""));
    console.log({ data });
    return result;
  };

  private getCustomFields = (data: object): string[] => {
    return data
      ? Object.keys(data).flatMap(element => {
          const field = data[element];
          return this.splitWords(field.value);
        })
      : [];
  };

  public getUserInfo(): userInfo {
    const customFields = this.getCustomFields(this.userResult.fields);
    const displayName = this.splitWords(this.userResult.display_name);
    const realName = this.splitWords(this.userResult.real_name);
    const title = this.splitWords(this.userResult.title);
    const userInfo = {
      title: this.userResult.title,
      field: customFields,
      displayName: displayName,
      realName: realName,
      arrayData: [customFields, displayName, realName, title]
        .flat()
        .filter(Boolean),
    };
    return userInfo;
  }
}

export default Profile;
