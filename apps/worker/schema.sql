DROP TABLE IF EXISTS projects;
CREATE TABLE IF NOT EXISTS projects (
	id TEXT NOT NULL PRIMARY KEY,
	name TEXT NOT NULL,
	owner_fid TEXT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_projects_owner_fid ON projects(owner_fid);


DROP TABLE IF EXISTS referrals;
CREATE TABLE IF NOT EXISTS referrals (
	id TEXT NOT NULL PRIMARY KEY,
	project_id TEXT NOT NULL,
	recipient_fid TEXT NOT NULL,
	referrer_fid TEXT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_referrals_project_id_referrer_fid ON referrals(project_id, referrer_fid);
CREATE UNIQUE INDEX IF NOT EXISTS idx_referrals_project_id_referrer_fid_recipient_fid ON referrals(project_id, referrer_fid, recipient_fid);

DROP TABLE IF EXISTS project_users;
CREATE TABLE IF NOT EXISTS project_users (
	id TEXT NOT NULL PRIMARY KEY,
	project_id TEXT NOT NULL,
	user_fid TEXT NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_project_users_project_id ON project_users(project_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_project_users_project_id_user_fid ON project_users(project_id, user_fid);
