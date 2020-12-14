import firestore from "./firestore";
import { userDocument } from "./types/userDocument";

export default async (payloadText: string): Promise<userDocument[]> => {
    const hitUser = [];

    // firestoreのデータを取得
    return new Promise((resolve, rejects) => {
        firestore
            .collection(`users`)
            .get()
            .then(user => {
                let isMentioned = false;
                user.forEach(content => {
                    const data = content.data();

                    isMentioned = data.arrayData.some(keyword => {
                        console.log({ payloadText, keyword });
                        return payloadText.includes(keyword);
                    });
                    if (isMentioned) {
                        hitUser.push({ id: `${content.id}___`, data });
                        isMentioned = false;
                        console.log({ data });
                    }
                });
                resolve(hitUser);
            })
            .catch(err => {
                console.log("Error getting documents", err);
                rejects();
            });
    });
};
