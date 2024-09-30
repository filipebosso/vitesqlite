import { CapacitorSQLite,  SQLiteConnection} from "@capacitor-community/sqlite";

export const sqlite = new SQLiteConnection(CapacitorSQLite);
export let db = null

export const iniciar = async () => {
    const platform = Capacitor.getPlatform();

    if (platform === "web") {
      const jeepSqliteEl = document.createElement("jeep-sqlite");
      document.body.appendChild(jeepSqliteEl);
      await customElements.whenDefined("jeep-sqlite");
      await sqlite.initWebStore();
    }
}

export const connect = async (dbName) => {
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection(`${dbName}`, false)).result;
    if (ret.result && isConn) {
        db = await sqlite.retrieveConnection(`${dbName}`, false);
    } else {
        db = await sqlite.createConnection(`${dbName}`, false, "no-encryption", 1, false);
    }
    await db.open();
    console.log(`db: ${dbName} opened`);
}