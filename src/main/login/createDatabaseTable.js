const dbInit = require('../sqlite/init');

function isEmptyObject(e) {
  let t;
  for (t in e)
    return !1;
  return !0
}

const createDatabaseTable = _createDatabaseTableIpc => ({
  ['create-database-table'](event, databaseTable) {
    const requestBack = data => {
      _createDatabaseTableIpc.sendToClient('create-database-table-back', data)
    };

    if(databaseTable == null) {
      console.log("get create database and table mark from front is null");
    } else {
      console.log("get create database and table mark from front success and databaseTable is" + databaseTable);
      const db = dbInit.checkCreateLinkeyeDb();
      if(!db){
        console.log("db handle is null")
        requestBack({
          success: false,
          error:"db handle is null",
          errorCode:800,
        })
      }

      const errOne = dbInit.createLoginTable("login", db);
      if(errOne === "errthree"){
        console.log('create login table fail');
        requestBack({
          success:false,
          error:"create login table fail",
          errorCode:801,
        })
      } else {
        const sql = "SELECT login_passwd FROM login";
        db.all(sql, function w(err, row) {
          console.log("Query login database success and data in database is + " + JSON.stringify(row));
          if(isEmptyObject(row)) {
            console.log("=========enter here=========")
            const insert = db.prepare("INSERT INTO login(login_id, login_passwd, is_login) VALUES (?, ?, ?)");
            insert.run("linkeyeID", "smartshare", "0");
            insert.finalize();
            db.close();
          } else {
            console.log("Query login table of database success and row is + " + row);
          }
        });
        const errTwo = dbInit.createAccountTable("account", db);
        if(errTwo === "errone"){
          console.log('create account table fail');
          requestBack({
            success: false,
            error:"create account table fail",
            errorCode:802,
          })
        } else {
          let errThree = dbInit.createSendTable("record", db);
          if(errThree === "errtwo"){
            console.log('create record table fail');
            requestBack({
              success: false,
              error:"create record table fail",
              errorCode:803,
            })
          } else {
            requestBack({
              success: true,
              DBAmsg:"success"
            })
          }
        }
      }
    }
  }
});

export default createDatabaseTable
