const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'netflix.db');

let db;
let SQL;

// Sync wrapper — emulate better-sqlite3 API so routes stay unchanged
function loadDb() {
  const fileBuffer = fs.existsSync(dbPath) ? fs.readFileSync(dbPath) : null;
  db = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();

  // WAL mode not supported in sql.js — skip pragma
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS watchlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      movie_id INTEGER NOT NULL,
      movie_title TEXT NOT NULL,
      movie_poster TEXT,
      movie_backdrop TEXT,
      movie_overview TEXT,
      movie_rating REAL,
      media_type TEXT DEFAULT 'movie',
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, movie_id)
    );
  `);

  persist();
  console.log('✅ Database initialized (sql.js)');
}

function persist() {
  const data = db.export();
  fs.writeFileSync(dbPath, Buffer.from(data));
}

// better-sqlite3 compatible API shim
const dbWrapper = {
  prepare(sql) {
    return {
      get(...params) {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.free();
          return row;
        }
        stmt.free();
        return undefined;
      },
      all(...params) {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        const rows = [];
        while (stmt.step()) rows.push(stmt.getAsObject());
        stmt.free();
        return rows;
      },
      run(...params) {
        const stmt = db.prepare(sql);
        stmt.bind(params);
        stmt.step();
        stmt.free();
        const changes = db.getRowsModified();
        const lastId = db.exec('SELECT last_insert_rowid()')[0];
        const lastInsertRowid = lastId ? lastId.values[0][0] : null;
        persist();
        return { changes, lastInsertRowid };
      }
    };
  },
  exec(sql) {
    db.exec(sql);
    persist();
  }
};

// Initialize synchronously using the synchronous WASM build
try {
  SQL = require('sql.js')({ locateFile: () => require.resolve('sql.js/dist/sql-wasm.wasm') });
  // sql.js returns a promise, handle both sync and async
  if (SQL && typeof SQL.then === 'function') {
    // Async init — we do this at module level with a sync-ish workaround
    let resolved = false;
    SQL.then((SqlLib) => {
      SQL = SqlLib;
      loadDb();
      resolved = true;
    }).catch(err => {
      console.error('sql.js init error:', err);
    });
    // Wait up to 3s for init
    const start = Date.now();
    while (!resolved && Date.now() - start < 3000) {
      require('child_process').spawnSync('node', ['-e', ''], { timeout: 10 });
    }
  } else {
    loadDb();
  }
} catch(e) {
  console.error('DB init failed:', e);
}

module.exports = dbWrapper;
