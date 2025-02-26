import cron from "node-cron";
import db from "../config/database.js";

cron.schedule("*/5 * * * *", () => {
  const now = new Date();

  const sql = `DELETE FROM users WHERE is_verified = 0 AND expired_code < ?`;

  db.query(sql, [now], (err, results) => {
    if (err) {
      console.error("❌ Failed to delete expired users:", err);
    }
  });
});

export { cron };
