import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateAdministrador1715989814980 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "administrador",
            columns: [
                { name: "idconta", type: "int", isPrimary: true},
                { name: "deletedAt", type: "timestamp", isNullable: true },
                { name: "nome", type: "varchar", length: "60", isNullable: false }
            ],
        }));

        /*queryRunner.query(`
            INSERT INTO administrador (nome, email, senha, tipo)
            VALUES ('Administrador1', 'admin@admin.com', '$2b$10$NP2vw0k/IQPjPo0/00DhBeOpU4lZdnNT1j3zJCJkdG1JMYukgRL1i', 'Administrador')
        `);*/
        await queryRunner.createForeignKey("administrador", new TableForeignKey({
            columnNames: ["idconta"],
            referencedTableName: "conta",
            referencedColumnNames: ["idconta"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("administrador");
    }

}
