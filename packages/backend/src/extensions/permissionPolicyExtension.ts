import { createBackendModule } from '@backstage/backend-plugin-api';
import { BackstageIdentityResponse } from '@backstage/plugin-auth-node';
import {
  PolicyDecision,
  AuthorizeResult,
  isPermission,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
} from '@backstage/plugin-permission-node';
import { policyExtensionPoint } from '@backstage/plugin-permission-node/alpha';
import {
  taskCancelPermission,
  taskCreatePermission,
  taskReadPermission,
} from '@backstage/plugin-scaffolder-common/alpha';

const GUEST_USER_REF = 'user:default/guest';

class CustomPermissionPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    if (isPermission(request.permission, taskCreatePermission)) {
      if (user?.identity.userEntityRef === GUEST_USER_REF) {
        return {
          result: AuthorizeResult.ALLOW,
        };
      }
    }
    if (isPermission(request.permission, taskCancelPermission)) {
      if (user?.identity.userEntityRef === GUEST_USER_REF) {
        return {
          result: AuthorizeResult.DENY,
        };
      }
    }
    if (isPermission(request.permission, taskReadPermission)) {
      if (user?.identity.userEntityRef === GUEST_USER_REF) {
        return {
          result: AuthorizeResult.DENY,
        };
      }
    }

    return {
      result: AuthorizeResult.ALLOW,
    };
  }
}

export default createBackendModule({
  pluginId: 'permission',
  moduleId: 'custom-policy',
  register(reg) {
    reg.registerInit({
      deps: { policy: policyExtensionPoint },
      async init({ policy }) {
        policy.setPolicy(new CustomPermissionPolicy());
      },
    });
  },
});
