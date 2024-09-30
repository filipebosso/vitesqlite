import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';
import { defineCustomElements } from 'jeep-sqlite/loader';

export const initSQLite = async () => {
    // Definir o elemento customizado no DOM
    defineCustomElements(window);

    if (window?.JeepSqlite) {
        const jeepSqliteEl = document.createElement('jeep-sqlite');
        document.body.appendChild(jeepSqliteEl);
        await customElements.whenDefined('jeep-sqlite');
    }

    // Inicializando a conexão SQLite
    const sqlite = CapacitorSQLite;
    const sqliteConnection = new SQLiteConnection(sqlite);
    
    // Retornar a conexão
    return sqliteConnection;
};
