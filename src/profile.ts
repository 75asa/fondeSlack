// eslint-disable-next-line import/no-extraneous-dependencies
import { WebAPICallResult } from "@slack/web-api";
import { userInfo as userInfoType } from "./types/userInfo";
import { userResult, fields } from "./types/userResult";

class Profile {
    private userResult: userResult;

    public constructor(apiResult: WebAPICallResult) {
        this.userResult = apiResult.profile as userResult;
    }

    // 検索対象に含めたくないslackのプロフィール項目名
    private IGNORE_CUSTOM_FIELDS_LABEL = ["部署"];

    private splitWords = (data: string): string[] => {
        if (!data) return [];

        // チームによってSlackプロフィールの設定ルールがあると思うのでここは区切りたい文字で
        const specialChar = /\/||／/;
        const result = data
            .split(/\s+/)
            .filter(item => item.replace(specialChar, ""));
        console.log({ data });
        return result;
    };

    private getCustomFields = (data: fields): string[] => {
        if (!data) return [];
        return Object.keys(data).flatMap(element => {
            const field = data[element];
            if (this.IGNORE_CUSTOM_FIELDS_LABEL.includes(field.label)) {
                return "";
            }
            return this.splitWords(field.value);
        });
    };

    public getUserInfo(): userInfoType {
        const customFields = this.getCustomFields(this.userResult.fields);
        const displayName = this.splitWords(this.userResult.display_name);
        const realName = this.splitWords(this.userResult.real_name);
        const title = this.splitWords(this.userResult.title);
        const userInfo = {
            title: this.userResult.title,
            field: customFields,
            displayName,
            realName,
            arrayData: [customFields, displayName, realName, title]
                .flat()
                .filter(Boolean),
        };
        return userInfo;
    }
}

export default Profile;
