const { createPagesWithData } = require('../createPagesWithData');

const templates = {
  programListPage: 'program list component',
  programPage: 'program page component',
  enterpriseDashboardPage: 'enterprise dashboard page component',
};

describe('createPagesWithData', () => {
  it('should only create page based on the type in first node in nodes', () => {
    const graphqlQueryResult = {
      data: {
        allPage: {
          nodes: [
            {
              id: '0de66c11-6c9a-538b-aeb6-767f0013c96d',
              slug: null,
              title: 'Example Enterprise',
              type: 'pages.EnterprisePage',
              uuid: '47fc98b8-9a90-406d-854b-a4e91df0bc8c',
              hostname: null,
              program_documents: null,
              external_program_website: null,
              branding: {},
              contact_email: 'hi@testorg.com',
            },
            {
              id: '0de66c11-6c9a-538b-aeb6-767f0013c96d',
              slug: null,
              title: 'Some program we should ignore',
              type: 'pages.ProgramPage',
              uuid: '47fc98b8-9a90-406d-854b-a4e91df0bc8c',
              hostname: null,
              program_documents: null,
              external_program_website: null,
              branding: {},
              contact_email: null,
            },
          ],
        },
      },
    };
    const actions = { createPage: jest.fn() };

    createPagesWithData(graphqlQueryResult, actions, templates);

    const expectedArgs = {
      path: '/',
      component: templates.enterpriseDashboardPage,
      context: {
        pageType: 'pages.EnterprisePage',
        pageBranding: {},
        enterpriseName: 'Example Enterprise',
        enterpriseUUID: '47fc98b8-9a90-406d-854b-a4e91df0bc8c',
        enterpriseEmail: 'hi@testorg.com',
      },
    };
    expect(actions.createPage.mock.calls.length).toEqual(1);
    expect(actions.createPage).toBeCalledWith({ ...expectedArgs });
  });

  it('should create both a single program page and program list page if only one program page node is present', () => {
    const graphqlQueryResult = {
      data: {
        allPage: {
          nodes: [
            {
              id: '0de66c11-6c9a-538b-aeb6-767f0013c96d',
              slug: 'prog-slug',
              title: 'The best program ever',
              type: 'pages.ProgramPage',
              uuid: '47fc98b8-9a90-406d-854b-a4e91df0bc8c',
              hostname: null,
              program_documents: null,
              external_program_website: null,
              branding: {},
              contact_email: null,
            },
            {
              id: '0de66c11-6c9a-538b-aeb6-767f0013c96d',
              slug: null,
              title: 'Example Enterprise',
              type: 'pages.EnterprisePage',
              uuid: '47fc98b8-9a90-406d-854b-a4e91df0bc8c',
              hostname: null,
              program_documents: null,
              external_program_website: null,
              branding: {},
              contact_email: 'hi@testorg.com',
            },
          ],
        },
      },
    };
    const actions = { createPage: jest.fn() };

    createPagesWithData(graphqlQueryResult, actions, templates);

    const programPageData = {
      pageType: 'pages.ProgramPage',
      pageBranding: {},
      programSlug: 'prog-slug',
      programUUID: '47fc98b8-9a90-406d-854b-a4e91df0bc8c',
      programName: 'The best program ever',
      programHostname: null,
      programDocuments: null,
      externalProgramWebsite: null,
    };
    const expectedProgramPageArgs = {
      path: 'prog-slug',
      component: templates.programPage,
      context: programPageData,
    };
    const expectedProgramListPageArgs = {
      path: '/',
      component: templates.programListPage,
      context: { programs: [programPageData] },
    };

    expect(actions.createPage.mock.calls.length).toEqual(2);
    expect(actions.createPage).toBeCalledWith(expectedProgramListPageArgs);
    expect(actions.createPage).toBeCalledWith(expectedProgramPageArgs);
  });

  it('should create list page if multiple program pages nodes exist.', () => {
    const graphqlQueryResult = {
      data: {
        allPage: {
          nodes: [
            {
              id: '0de66c11-6c9a-538b-aeb6-767f0013c96d',
              slug: 'prog-slug-1',
              title: 'Program 1',
              type: 'pages.ProgramPage',
              uuid: '47fc98b8-9a90-406d-854b-a4e91df0bc8c',
              hostname: null,
              program_documents: null,
              external_program_website: null,
              branding: {},
              contact_email: null,
            },
            {
              id: '0de66c11-6c9a-538b-aeb6-767f0013c96a',
              slug: 'prog-slug-2',
              title: 'Program 2',
              type: 'pages.ProgramPage',
              uuid: '47fc98b8-9a90-406d-854b-a4e91df0bc8d',
              hostname: null,
              program_documents: null,
              external_program_website: null,
              branding: {},
              contact_email: null,
            },
          ],
        },
      },
    };
    const actions = { createPage: jest.fn() };

    createPagesWithData(graphqlQueryResult, actions, templates);

    const expectedContext = {
      programs: [
        {
          pageType: 'pages.ProgramPage',
          pageBranding: {},
          programDocuments: null,
          programHostname: null,
          programUUID: '47fc98b8-9a90-406d-854b-a4e91df0bc8c',
          programName: 'Program 1',
          programSlug: 'prog-slug-1',
          externalProgramWebsite: null,
        },
        {
          pageType: 'pages.ProgramPage',
          pageBranding: {},
          programDocuments: null,
          programHostname: null,
          programUUID: '47fc98b8-9a90-406d-854b-a4e91df0bc8d',
          programName: 'Program 2',
          programSlug: 'prog-slug-2',
          externalProgramWebsite: null,
        },
      ],
    };
    const expectedArgs = {
      path: '/',
      component: templates.programListPage,
      context: expectedContext,
    };
    expect(actions.createPage.mock.calls.length).toEqual(3);
    expect(actions.createPage).toHaveBeenNthCalledWith(1, { ...expectedArgs });
  });

  it('should only create list page (and no program pages) if onlyCreateListingPage is true', () => {
    const graphqlQueryResult = {
      data: {
        allPage: {
          nodes: [
            {
              id: '0de66c11-6c9a-538b-aeb6-767f0013c96d',
              slug: 'prog-slug-1',
              title: 'Program 1',
              type: 'pages.ProgramPage',
              uuid: '47fc98b8-9a90-406d-854b-a4e91df0bc8c',
              hostname: null,
              program_documents: null,
              external_program_website: null,
              branding: {},
              contact_email: null,
            },
            {
              id: '0de66c11-6c9a-538b-aeb6-767f0013c96a',
              slug: 'prog-slug-2',
              title: 'Program 2',
              type: 'pages.ProgramPage',
              uuid: '47fc98b8-9a90-406d-854b-a4e91df0bc8d',
              hostname: null,
              program_documents: null,
              external_program_website: null,
              branding: {},
              contact_email: null,
            },
          ],
        },
      },
    };
    const actions = { createPage: jest.fn() };
    process.env.UNBRANDED_LANDING_PAGE = 'True';

    createPagesWithData(graphqlQueryResult, actions, templates);

    const expectedContext = {
      programs: [
        {
          pageType: 'pages.ProgramPage',
          pageBranding: {},
          programDocuments: null,
          programHostname: null,
          programUUID: '47fc98b8-9a90-406d-854b-a4e91df0bc8c',
          programName: 'Program 1',
          programSlug: 'prog-slug-1',
          externalProgramWebsite: null,
        },
        {
          pageType: 'pages.ProgramPage',
          pageBranding: {},
          programDocuments: null,
          programHostname: null,
          programUUID: '47fc98b8-9a90-406d-854b-a4e91df0bc8d',
          programName: 'Program 2',
          programSlug: 'prog-slug-2',
          externalProgramWebsite: null,
        },
      ],
    };
    const expectedArgs = {
      path: '/',
      component: templates.programListPage,
      context: expectedContext,
    };
    expect(actions.createPage.mock.calls.length).toEqual(1);
    expect(actions.createPage).toBeCalledWith({ ...expectedArgs });
  });
});
