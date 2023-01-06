import React, { Fragment } from "react";
// import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
//
import Tab from "@mui/material/Tab";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
// app component
import BookStats from "./BookStats";
import BookReview from "@src/components/shared/review";
import BookContent from "./BookContent";
import BookAbstract from "./BookAbstract";
// interface, styles and config
import useTabStyle from "@src/styles/tab";
import useGlobalStyle from "@src/styles/index";
import { BookDetailsPageFunc } from "./interfaceType";

const DetailsSection: BookDetailsPageFunc = (props) => {
  const [value, setValue] = React.useState("1");
  const tabStyle = useTabStyle();
  const globalStyle = useGlobalStyle();

  //
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <Box component="section" sx={{ pb: 8 }}>
        <TabContext value={value}>
          <Box>
            <Box
              top={0}
              zIndex={2}
              bgcolor="white"
              position="sticky"
              sx={{ px: { md: 6 } }}
              className={globalStyle.paperShadowSm}
            >
              <Container maxWidth="xl" sx={{ mb: -0.3 }}>
                <TabList
                  onChange={handleChange}
                  textColor="inherit"
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  aria-label="Publication tab contents"
                  className={`${tabStyle.appTab} tab-justify-start`}
                >
                  <Tab label="Abstract" value="1" />
                  <Tab label="Table of Contents" value="2" />
                  <Tab label="Reviews" value="6" />
                </TabList>
              </Container>
            </Box>
            <Container maxWidth="xl" sx={{ px: { sm: 4, md: 6, xl: 3 } }}>
              <Grid container spacing={{ xs: 2, xl: 0 }}>
                <Grid item xs={12} md={8} xl={9}>
                  <TabPanel
                    value="1"
                    sx={{ px: { xs: 1, md: 4, lg: 3, xl: 0 } }}
                  >
                    <BookAbstract {...props} />
                  </TabPanel>
                  <TabPanel
                    value="2"
                    sx={{ px: { xs: 0, md: 4, lg: 3, xl: 0 } }}
                  >
                    <BookContent {...props} />
                  </TabPanel>
                  <TabPanel
                    value="6"
                    sx={{ px: { xs: 1, md: 4, lg: 3, xl: 0 } }}
                  >
                    <BookReview
                      isSubscriber={Boolean(
                        props.auth?.isCentreManager ||
                          props.auth?.isPublicationSubscriber
                      )}
                      contentId={props.publication.id}
                      allowReview={props.publication.allowReview}
                    />
                  </TabPanel>
                </Grid>
                <Grid item xs={12} md={4} xl={3}>
                  <Box
                    p={3}
                    mt={3}
                    top="2rem"
                    borderRadius={3}
                    position="sticky"
                    className={globalStyle.paperShadowSm}
                  >
                    <BookStats {...props} />
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </TabContext>
      </Box>
    </Fragment>
  );
};
export default DetailsSection;
