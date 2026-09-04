package com.latacoffee.core_service.db.migration;

import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;

import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.sql.Statement;

public class V2__create_reservation_table extends BaseJavaMigration {

    @Override
    public void migrate(Context context) throws Exception {
        DatabaseMetaData metaData = context.getConnection().getMetaData();

        try (ResultSet tables = metaData.getTables(null, null, "reservation", null)) {
            if (tables.next()) {
                return;
            }
        }

        try (Statement statement = context.getConnection().createStatement()) {
            statement.execute(
                "CREATE TABLE reservation (" +
                "id BIGSERIAL PRIMARY KEY," +
                "user_email VARCHAR(255) NOT NULL," +
                "date DATE," +
                "time TIME," +
                "party INTEGER NOT NULL," +
                "name VARCHAR(255)," +
                "phone VARCHAR(255)," +
                "status VARCHAR(255) NOT NULL DEFAULT 'PENDING'," +
                "CONSTRAINT reservation_status_check CHECK (status IN ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED'))" +
                ")"
            );
        }
    }
}