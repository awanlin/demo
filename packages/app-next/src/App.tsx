// import { badgesPlugin, signalsPlugin } from './plugins';

import {
  AlertDisplay,
  OAuthRequestDialog,
  ProxiedSignInPage,
} from '@backstage/core-components';
import { AppRouter, FlatRoutes } from '@backstage/core-app-api';
import {
  CatalogEntityPage,
  CatalogIndexPage,
  catalogPlugin,
} from '@backstage/plugin-catalog';
import {
  CatalogGraphPage,
  catalogGraphPlugin,
} from '@backstage/plugin-catalog-graph';
import {
  CostInsightsLabelDataflowInstructionsPage,
  CostInsightsPage,
  CostInsightsProjectGrowthInstructionsPage,
} from '@backstage-community/plugin-cost-insights';
import { ExplorePage } from '@backstage-community/plugin-explore';
import { Navigate, Route } from 'react-router';
import {
  TechDocsIndexPage,
  TechDocsReaderPage,
  techdocsPlugin,
} from '@backstage/plugin-techdocs';
import { UnifiedThemeProvider } from '@backstage/theme';

import { ApiExplorerPage } from '@backstage/plugin-api-docs';
import { GraphiQLPage } from '@backstage-community/plugin-graphiql';
import React from 'react';
import { SearchPage } from '@backstage/plugin-search';
import { TechRadarPage } from '@backstage-community/plugin-tech-radar';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { apertureTheme } from './theme/aperture';
import { entityPage } from './components/catalog/EntityPage';
import { orgPlugin } from '@backstage/plugin-org';
import { searchPage } from './components/search/SearchPage';
import { HomepageCompositionRoot } from '@backstage/plugin-home';
import { CustomizableHomePage } from './components/home/CustomizableHomePage';
import { ScaffolderPage, scaffolderPlugin } from '@backstage/plugin-scaffolder';
import { NotificationsPage } from '@backstage/plugin-notifications';

import { createApp } from '@backstage/frontend-app-api';
import {
  createExtensionOverrides,
  PageBlueprint,
  SignInPageBlueprint,
  ThemeBlueprint,
} from '@backstage/frontend-plugin-api';
import {
  convertLegacyApp,
  convertLegacyRouteRef,
  convertLegacyRouteRefs,
} from '@backstage/core-compat-api';
import { apis } from './apis';
import { nav } from './components/Root/Root';

const proxiedSignInPage = SignInPageBlueprint.make({
  name: 'proxied-sign-in-page',
  params: {
    loader: async () => props => (
      <ProxiedSignInPage {...props} provider="guest" />
    ),
  },
});

const apertureThemeExtension = ThemeBlueprint.make({
  name: 'aperture',
  params: {
    theme: {
      id: 'aperture',
      title: 'Aperture Theme',
      variant: 'light',
      Provider: ({ children }) => (
        <UnifiedThemeProvider theme={apertureTheme} children={children} />
      ),
    },
  },
});

const catalogPageRedirectExtension = PageBlueprint.make({
  name: 'catalogPage',
  params: {
    defaultPath: '/',
    loader: async () => <Navigate to="/catalog" />,
  },
});

const routes = (
  <FlatRoutes>
    <Route path="/home" element={<HomepageCompositionRoot />}>
      <CustomizableHomePage />
    </Route>
    <Route path="/create" element={<ScaffolderPage />} />
    <Route path="/api-docs" element={<ApiExplorerPage />} />
    <Route
      path="/catalog"
      element={
        <CatalogIndexPage
          initiallySelectedFilter="all"
          initiallySelectedNamespaces={['default']}
        />
      }
    />
    <Route
      path="/catalog/:namespace/:kind/:name"
      element={<CatalogEntityPage />}
    >
      {entityPage}
    </Route>
    <Route path="/cost-insights" element={<CostInsightsPage />} />
    <Route
      path="/cost-insights/investigating-growth"
      element={<CostInsightsProjectGrowthInstructionsPage />}
    />
    <Route
      path="/cost-insights/labeling-jobs"
      element={<CostInsightsLabelDataflowInstructionsPage />}
    />
    <Route path="/docs" element={<TechDocsIndexPage />} />
    <Route
      path="/docs/:namespace/:kind/:name/*"
      element={<TechDocsReaderPage />}
    />
    <Route path="/explore" element={<ExplorePage />} />
    <Route path="/graphiql" element={<GraphiQLPage />} />
    <Route path="/search" element={<SearchPage />}>
      {searchPage}
    </Route>
    <Route path="/settings" element={<UserSettingsPage />} />
    <Route
      path="/tech-radar"
      element={<TechRadarPage width={1500} height={800} />}
    />
    <Route path="/catalog-graph" element={<CatalogGraphPage />} />
    <Route path="/notifications" element={<NotificationsPage />} />
  </FlatRoutes>
);

// const legacyFeatures = convertLegacyApp(
//   <>
//     <AlertDisplay transientTimeoutMs={2500} />
//     <OAuthRequestDialog />
//     <AppRouter>
//       <VisitListener />
//       <Root>{routes}</Root>
//     </AppRouter>
//   </>,
// );

const legacyFeatures = convertLegacyApp(routes);

const app = createApp({
  features: [
    ...legacyFeatures,
    createExtensionOverrides({
      extensions: [
        proxiedSignInPage,
        apertureThemeExtension,
        catalogPageRedirectExtension,
        nav,
        ...apis,
      ],
    }),
  ],
  bindRoutes({ bind }) {
    bind(convertLegacyRouteRefs(catalogPlugin.externalRoutes), {
      createComponent: convertLegacyRouteRef(scaffolderPlugin.routes.root),
      viewTechDoc: convertLegacyRouteRef(techdocsPlugin.routes.docRoot),
      createFromTemplate: convertLegacyRouteRef(
        scaffolderPlugin.routes.selectedTemplate,
      ),
    });
    bind(convertLegacyRouteRefs(scaffolderPlugin.externalRoutes), {
      viewTechDoc: convertLegacyRouteRef(techdocsPlugin.routes.docRoot),
    });
    bind(convertLegacyRouteRefs(catalogGraphPlugin.externalRoutes), {
      catalogEntity: convertLegacyRouteRef(catalogPlugin.routes.catalogEntity),
    });
    bind(convertLegacyRouteRefs(orgPlugin.externalRoutes), {
      catalogIndex: convertLegacyRouteRef(catalogPlugin.routes.catalogIndex),
    });
  },
});

export default app.createRoot();
