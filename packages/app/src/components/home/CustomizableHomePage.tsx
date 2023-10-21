import { Page, Content } from '@backstage/core-components';
import {
  HomePageCompanyLogo,
  TemplateBackstageLogo,
  TemplateBackstageLogoIcon,
  HomePageStarredEntities,
  HomePageToolkit,
  CustomHomepageGrid,
  HomePageRandomJoke,
  HomePageTopVisited,
  HomePageRecentlyVisited,
} from '@backstage/plugin-home';
import { HomePageSearchBar } from '@backstage/plugin-search';
import { Grid, makeStyles } from '@material-ui/core';
import React from 'react';

const useLogoStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(5, 0),
  },
  svg: {
    width: 'auto',
    height: 100,
  },
  path: {
    fill: '#7df3e1',
  },
}));

const tools = Array(4).fill({
  url: '#',
  label: 'link',
  icon: <TemplateBackstageLogoIcon />,
});

const defaultConfig = [
  {
    component: 'HomePageSearchBar',
    x: 0,
    y: 0,
    width: 24,
    height: 2,
  },
  {
    component: 'HomePageRecentlyVisited',
    x: 0,
    y: 2,
    width: 16,
    height: 4,
  },
  {
    component: 'HomePageTopVisited',
    x: 6,
    y: 2,
    width: 16,
    height: 4,
  },
  {
    component: 'HomePageToolkit',
    x: 6,
    y: 2,
    width: 16,
    height: 4,
  },
  {
    component: 'HomePageStarredEntities',
    x: 6,
    y: 2,
    width: 16,
    height: 4,
  },
];

export const CustomizableHomePage = () => {
  const { svg, path, container } = useLogoStyles();

  return (
    <Page themeId="home">
      <Content>
        <Grid container justifyContent="center">
          <HomePageCompanyLogo
            className={container}
            logo={<TemplateBackstageLogo classes={{ svg, path }} />}
          />
        </Grid>

        <CustomHomepageGrid config={defaultConfig}>
          <HomePageSearchBar />
          <HomePageRecentlyVisited />
          <HomePageTopVisited />
          <HomePageToolkit tools={tools} />
          <HomePageStarredEntities />
          <HomePageRandomJoke />
        </CustomHomepageGrid>
      </Content>
    </Page>
  );
};
