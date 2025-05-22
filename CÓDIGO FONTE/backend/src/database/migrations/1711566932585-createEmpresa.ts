import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateEmpresa1711566932585 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "empresa",
            columns: [
                { name: "idconta", type: "int", isPrimary: true},
                { name: "nome_empresa", type: "varchar", length: "60", isNullable: false },
                { name: "cnpj", type: "varchar", length: "14", isNullable: false },
                { name: "site", type: "varchar", length: "45", isNullable: true },
                { name: "telefone", type: "varchar", length: "11", isNullable: true },
                { name: "email", type: "varchar", length: "50", isNullable: false },
                { name: "deletedAt", type: "timestamp", isNullable: true },
            ],
        }));

        /*
        queryRunner.query(`
        INSERT INTO empresa (nome_empresa, cnpj, email, senha, cep, uf, cidade, logradouro, numero, tipo, idArea)
        VALUES ('Empresa1', '04712500000107', 'emp@gmail.com', '$2b$10$NP2vw0k/IQPjPo0/00DhBeOpU4lZdnNT1j3zJCJkdG1JMYukgRL1i', '19470000', 'SP', 'Cidade1', 'Logradouro1', '1-23', 'Empresa', 1);
        `);
        */

        await queryRunner.createForeignKey("empresa", new TableForeignKey({
            columnNames: ["idconta"],
            referencedTableName: "conta",
            referencedColumnNames: ["idconta"],
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("empresa");
    }
}