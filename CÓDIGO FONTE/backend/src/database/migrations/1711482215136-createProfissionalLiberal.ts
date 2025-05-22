import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateProfissionalLiberal1711482215136 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "profissional_liberal",
            columns: [
                { name: "idconta", type: "int", isPrimary: true },
                { name: "nome", type: "varchar", length: "60" },
                { name: "nome_social", type: "varchar", length: "60", isNullable: true },
                { name: "descricao", type: "text" },
                { name: "arquivo_imagem", type: "text", isNullable: true },
                { name: "telefone", type: "varchar", length: "11" },
                { name: "email", type: "varchar", length: "50" },
                { name: "deletedAt", type: "timestamp", isNullable: true },
            ],

        }));

        await queryRunner.createForeignKey("profissional_liberal", new TableForeignKey({
            columnNames: ["idconta"],
            referencedTableName: "conta",
            referencedColumnNames: ["idconta"],
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("profissional_liberal");
    }
}
