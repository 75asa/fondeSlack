import { app } from './bolt';
import notify from './notify';
import  *  as member from './member';

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();

member.set()
member.get()
