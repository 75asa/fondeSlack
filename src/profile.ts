import { WebAPICallResult } from "@slack/web-api";

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

interface userInfo {
  title: string;
  displayName: string[];
  realName: string[];
  field: string[];
  arrayData: string[];
}

class Profile {
  private userResult: userResult;
  private apiResult: WebAPICallResult;

  // public constructor(userResult: userResult) {
  //   this.userResult = userResult;
  // }
  public constructor(apiResult: WebAPICallResult) {
    this.userResult = apiResult.profile as userResult
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
    const customFieldsMap = this.getCustomFields(this.userResult.fields);
    const displayName = this.splitWords(this.userResult.display_name);
    const realName = this.splitWords(this.userResult.real_name);
    const userInfo = {
      title: this.userResult.title,
      field: customFieldsMap,
      displayName: displayName,
      realName: realName,
      arrayData: customFieldsMap
        .concat(displayName)
        .concat(realName)
        .concat([this.userResult.title])
        .flat()
        .filter(Boolean),
    };
    return userInfo;
  }
}

export default Profile;
