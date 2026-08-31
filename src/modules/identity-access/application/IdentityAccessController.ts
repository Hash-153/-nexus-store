import type { IEventBus } from "../../../shared/infrastructure/EventBus.ts";
import { Router } from "../../../api/http/Router.ts";
import { InMemoryUserRepository } from "../infrastructure/InMemoryUserRepository.ts";
import { InMemoryUserProfileRepository } from "../infrastructure/InMemoryUserProfileRepository.ts";
import { InMemoryRoleRepository } from "../infrastructure/InMemoryRoleRepository.ts";
import { InMemoryPermissionRepository } from "../infrastructure/InMemoryPermissionRepository.ts";
import { InMemorySessionRepository } from "../infrastructure/InMemorySessionRepository.ts";
import { InMemoryApiKeyRepository } from "../infrastructure/InMemoryApiKeyRepository.ts";
import { InMemoryAuditLogRepository } from "../infrastructure/InMemoryAuditLogRepository.ts";
import { InMemoryPasswordResetTokenRepository } from "../infrastructure/InMemoryPasswordResetTokenRepository.ts";
import { InMemoryAddressBookRepository } from "../infrastructure/InMemoryAddressBookRepository.ts";
import { InMemoryMfaConfigRepository } from "../infrastructure/InMemoryMfaConfigRepository.ts";
import { RegisterUserUseCase } from "./RegisterUserUseCase.ts";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase.ts";
import { RefreshTokenUseCase } from "./RefreshTokenUseCase.ts";
import { RevokeSessionUseCase } from "./RevokeSessionUseCase.ts";
import { UpdateProfileUseCase } from "./UpdateProfileUseCase.ts";
import { ChangePasswordUseCase } from "./ChangePasswordUseCase.ts";
import { ResetPasswordUseCase } from "./ResetPasswordUseCase.ts";
import { EnableMfaUseCase } from "./EnableMfaUseCase.ts";
import { VerifyMfaUseCase } from "./VerifyMfaUseCase.ts";
import { ManageRolesUseCase } from "./ManageRolesUseCase.ts";
import { AssignPermissionUseCase } from "./AssignPermissionUseCase.ts";
import { CreateApiKeyUseCase } from "./CreateApiKeyUseCase.ts";
import { RevokeApiKeyUseCase } from "./RevokeApiKeyUseCase.ts";
import { GetUserAuditLogsUseCase } from "./GetUserAuditLogsUseCase.ts";
import { ManageAddressesUseCase } from "./ManageAddressesUseCase.ts";

export interface IdentityAccessModuleContext {
  userRepo: InMemoryUserRepository;
  userProfileRepo: InMemoryUserProfileRepository;
  roleRepo: InMemoryRoleRepository;
  permissionRepo: InMemoryPermissionRepository;
  sessionRepo: InMemorySessionRepository;
  apiKeyRepo: InMemoryApiKeyRepository;
  auditLogRepo: InMemoryAuditLogRepository;
  passwordResetTokenRepo: InMemoryPasswordResetTokenRepository;
  addressBookRepo: InMemoryAddressBookRepository;
  mfaConfigRepo: InMemoryMfaConfigRepository;
  registerUserUseCase: RegisterUserUseCase;
  authenticateUserUseCase: AuthenticateUserUseCase;
  refreshTokenUseCase: RefreshTokenUseCase;
  revokeSessionUseCase: RevokeSessionUseCase;
  updateProfileUseCase: UpdateProfileUseCase;
  changePasswordUseCase: ChangePasswordUseCase;
  resetPasswordUseCase: ResetPasswordUseCase;
  enableMfaUseCase: EnableMfaUseCase;
  verifyMfaUseCase: VerifyMfaUseCase;
  manageRolesUseCase: ManageRolesUseCase;
  assignPermissionUseCase: AssignPermissionUseCase;
  createApiKeyUseCase: CreateApiKeyUseCase;
  revokeApiKeyUseCase: RevokeApiKeyUseCase;
  getUserAuditLogsUseCase: GetUserAuditLogsUseCase;
  manageAddressesUseCase: ManageAddressesUseCase;
}

export class IdentityAccessController {
  private readonly context: IdentityAccessModuleContext;

  constructor(eventBus: IEventBus) {
    const userRepo = new InMemoryUserRepository();
    const userProfileRepo = new InMemoryUserProfileRepository();
    const roleRepo = new InMemoryRoleRepository();
    const permissionRepo = new InMemoryPermissionRepository();
    const sessionRepo = new InMemorySessionRepository();
    const apiKeyRepo = new InMemoryApiKeyRepository();
    const auditLogRepo = new InMemoryAuditLogRepository();
    const passwordResetTokenRepo = new InMemoryPasswordResetTokenRepository();
    const addressBookRepo = new InMemoryAddressBookRepository();
    const mfaConfigRepo = new InMemoryMfaConfigRepository();
    
    const registerUserUseCase = new RegisterUserUseCase(userRepo, eventBus);
    const authenticateUserUseCase = new AuthenticateUserUseCase(userProfileRepo, eventBus);
    const refreshTokenUseCase = new RefreshTokenUseCase(roleRepo, eventBus);
    const revokeSessionUseCase = new RevokeSessionUseCase(permissionRepo, eventBus);
    const updateProfileUseCase = new UpdateProfileUseCase(sessionRepo, eventBus);
    const changePasswordUseCase = new ChangePasswordUseCase(apiKeyRepo, eventBus);
    const resetPasswordUseCase = new ResetPasswordUseCase(auditLogRepo, eventBus);
    const enableMfaUseCase = new EnableMfaUseCase(passwordResetTokenRepo, eventBus);
    const verifyMfaUseCase = new VerifyMfaUseCase(addressBookRepo, eventBus);
    const manageRolesUseCase = new ManageRolesUseCase(mfaConfigRepo, eventBus);
    const assignPermissionUseCase = new AssignPermissionUseCase(userRepo, eventBus);
    const createApiKeyUseCase = new CreateApiKeyUseCase(userProfileRepo, eventBus);
    const revokeApiKeyUseCase = new RevokeApiKeyUseCase(roleRepo, eventBus);
    const getUserAuditLogsUseCase = new GetUserAuditLogsUseCase(permissionRepo, eventBus);
    const manageAddressesUseCase = new ManageAddressesUseCase(sessionRepo, eventBus);

    this.context = {
      userRepo,
      userProfileRepo,
      roleRepo,
      permissionRepo,
      sessionRepo,
      apiKeyRepo,
      auditLogRepo,
      passwordResetTokenRepo,
      addressBookRepo,
      mfaConfigRepo,
      registerUserUseCase,
      authenticateUserUseCase,
      refreshTokenUseCase,
      revokeSessionUseCase,
      updateProfileUseCase,
      changePasswordUseCase,
      resetPasswordUseCase,
      enableMfaUseCase,
      verifyMfaUseCase,
      manageRolesUseCase,
      assignPermissionUseCase,
      createApiKeyUseCase,
      revokeApiKeyUseCase,
      getUserAuditLogsUseCase,
      manageAddressesUseCase,
    };
  }

  public getContext(): IdentityAccessModuleContext {
    return this.context;
  }

  public registerRoutes(router: Router): void {
    const basePath = "/api/v1/identity-access";

    
    router.register("GET", `${basePath}/users`, async (req, res) => {
      const items = await this.context.userRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/users/:id`, async (req, res, params) => {
      const item = await this.context.userRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "User not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/userprofiles`, async (req, res) => {
      const items = await this.context.userProfileRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/userprofiles/:id`, async (req, res, params) => {
      const item = await this.context.userProfileRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "UserProfile not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/roles`, async (req, res) => {
      const items = await this.context.roleRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/roles/:id`, async (req, res, params) => {
      const item = await this.context.roleRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Role not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/permissions`, async (req, res) => {
      const items = await this.context.permissionRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/permissions/:id`, async (req, res, params) => {
      const item = await this.context.permissionRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Permission not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/sessions`, async (req, res) => {
      const items = await this.context.sessionRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/sessions/:id`, async (req, res, params) => {
      const item = await this.context.sessionRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "Session not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/apikeys`, async (req, res) => {
      const items = await this.context.apiKeyRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/apikeys/:id`, async (req, res, params) => {
      const item = await this.context.apiKeyRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "ApiKey not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/auditlogs`, async (req, res) => {
      const items = await this.context.auditLogRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/auditlogs/:id`, async (req, res, params) => {
      const item = await this.context.auditLogRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "AuditLog not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/passwordresettokens`, async (req, res) => {
      const items = await this.context.passwordResetTokenRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/passwordresettokens/:id`, async (req, res, params) => {
      const item = await this.context.passwordResetTokenRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "PasswordResetToken not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/addressbooks`, async (req, res) => {
      const items = await this.context.addressBookRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/addressbooks/:id`, async (req, res, params) => {
      const item = await this.context.addressBookRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "AddressBook not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    router.register("GET", `${basePath}/mfaconfigs`, async (req, res) => {
      const items = await this.context.mfaConfigRepo.findAll();
      router.sendJson(res, 200, { success: true, count: items.length, data: items.map(i => i.toJSON()) });
    });

    router.register("GET", `${basePath}/mfaconfigs/:id`, async (req, res, params) => {
      const item = await this.context.mfaConfigRepo.findById(params.id);
      if (!item) {
        router.sendJson(res, 404, { success: false, error: { code: "NOT_FOUND", message: "MfaConfig not found" } });
        return;
      }
      router.sendJson(res, 200, { success: true, data: item.toJSON() });
    });
    

    
    router.register("POST", `${basePath}/actions/registeruser`, async (req, res, params, body) => {
      const result = await this.context.registerUserUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/authenticateuser`, async (req, res, params, body) => {
      const result = await this.context.authenticateUserUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/refreshtoken`, async (req, res, params, body) => {
      const result = await this.context.refreshTokenUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/revokesession`, async (req, res, params, body) => {
      const result = await this.context.revokeSessionUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/updateprofile`, async (req, res, params, body) => {
      const result = await this.context.updateProfileUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/changepassword`, async (req, res, params, body) => {
      const result = await this.context.changePasswordUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/resetpassword`, async (req, res, params, body) => {
      const result = await this.context.resetPasswordUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/enablemfa`, async (req, res, params, body) => {
      const result = await this.context.enableMfaUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/verifymfa`, async (req, res, params, body) => {
      const result = await this.context.verifyMfaUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/manageroles`, async (req, res, params, body) => {
      const result = await this.context.manageRolesUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/assignpermission`, async (req, res, params, body) => {
      const result = await this.context.assignPermissionUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/createapikey`, async (req, res, params, body) => {
      const result = await this.context.createApiKeyUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/revokeapikey`, async (req, res, params, body) => {
      const result = await this.context.revokeApiKeyUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/getuserauditlogs`, async (req, res, params, body) => {
      const result = await this.context.getUserAuditLogsUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    

    router.register("POST", `${basePath}/actions/manageaddresses`, async (req, res, params, body) => {
      const result = await this.context.manageAddressesUseCase.execute(body ?? {});
      router.sendJson(res, 200, { success: true, data: result });
    });
    
  }
}
