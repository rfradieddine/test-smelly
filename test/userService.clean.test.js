const { UserService } = require("../src/userService");

describe("UserService", () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB(); // Limpa o banco para cada teste
  });

  describe("createUser", () => {
    test("deve criar um usuário com dados válidos", () => {
      // Arrange
      const nome = "Fulano de Tal";
      const email = "fulano@teste.com";
      const idade = 25;

      // Act
      const usuario = userService.createUser(nome, email, idade);

      // Assert
      expect(usuario).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          nome,
          email,
          idade,
          status: "ativo",
          isAdmin: false,
        })
      );
    });

    test("deve rejeitar criação de usuário menor de idade", () => {
      // Arrange
      const nome = "Menor";
      const email = "menor@email.com";
      const idade = 17;

      // Act & Assert
      expect(() => {
        userService.createUser(nome, email, idade);
      }).toThrow("O usuário deve ser maior de idade.");
    });
  });

  describe("getUserById", () => {
    test("deve retornar um usuário existente pelo ID", () => {
      // Arrange
      const usuarioCriado = userService.createUser(
        "João",
        "joao@teste.com",
        30
      );

      // Act
      const usuarioEncontrado = userService.getUserById(usuarioCriado.id);

      // Assert
      expect(usuarioEncontrado).toEqual(usuarioCriado);
    });

    test("deve retornar undefined para ID inexistente", () => {
      // Act
      const usuario = userService.getUserById("id-inexistente");

      // Assert
      expect(usuario).toBeNull();
    });
  });

  describe("deactivateUser", () => {
    test("deve desativar um usuário comum com sucesso", () => {
      // Arrange
      const usuario = userService.createUser("Comum", "comum@teste.com", 30);

      // Act
      const resultado = userService.deactivateUser(usuario.id);

      // Assert
      expect(resultado).toBe(true);
      expect(userService.getUserById(usuario.id).status).toBe("inativo");
    });

    test("não deve permitir desativar um usuário administrador", () => {
      // Arrange
      const admin = userService.createUser(
        "Admin",
        "admin@teste.com",
        40,
        true
      );

      // Act
      const resultado = userService.deactivateUser(admin.id);

      // Assert
      expect(resultado).toBe(false);
      expect(userService.getUserById(admin.id).status).toBe("ativo");
    });
  });

  describe("generateUserReport", () => {
    test("deve incluir cabeçalho no relatório", () => {
      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toMatch(/^--- Relatório de Usuários ---/);
    });

    test("deve incluir informações básicas de cada usuário no relatório", () => {
      // Arrange
      const usuario = userService.createUser("Alice", "alice@email.com", 28);

      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toMatch(
        new RegExp(`ID: ${usuario.id}.*Nome: Alice.*Status: ativo`)
      );
    });

    test("deve retornar apenas cabeçalho quando não há usuários", () => {
      // Act
      const relatorio = userService.generateUserReport();

      // Assert
      expect(relatorio).toBe(
        "--- Relatório de Usuários ---\nNenhum usuário cadastrado."
      );
    });
  });
});
