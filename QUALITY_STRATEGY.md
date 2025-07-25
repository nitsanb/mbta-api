# mbta-api: Quality Strategy

How to ensure the quality of this application.

## Objectives 

This document provides a testing strategy for both the existing features as well as any additional work going forward. 

## Scope 

The testing strategy will focus on answering the "What" and "When" questions but will not go into implementation details ("How") of testing.

This strategy applies to the product under its current architecture. Any changes to the architecture, e.g. a UI layer, will require revisiting this strategy.

This strategy does not cover Feature Flags, A/B testing and assumes a single development environment and a staging environment.

Product defects/issues and rollback from production are also not in the scope of this document. 

## Testing 

### Unit tests 
Unit tests will be written for any function that contains business logic, i.e. `if` statements or other branching in code, exercising that branch/block of code. 

SWEs will own their unit tests and aspire to 100% coverage of logic-including functions. Unit tests should run on every PR.

### Functional Tests

As part of the SDLC, every new feature will require functional testing to verify that it meets the feature requirements. As part of feature design, PMs and QEs will scope and define the test cases that guarantee coverage, including both positive and negative scenarios.

New outward-facing features will require API tests. If a feature includes a change or addition to the mbta-api layer, or any other external system dependency, it will require integration tests that cover that change/addition as well (see test types below).

As part of feature development, the Software Engineers ('SWEs') will own their feature's quality and be responsible for implementing the API tests, using the testing framework owned and provided by the QE team and with any necessary support from the QE team.

QEs will be responsible for reviewing the implemented tests, ensuring correctness, coverage and traceability (see 'Observability' below).

### Regression Tests

Regression tests will make sure that existing requirements are still met, and new issues are not introduced following new features, updates and bug fixes.

The different types of regression tests, their ownership and execution cadence are detailed below.

#### API Tests
API Tests will be written to exercise each endpoint, simulating every use case defined in the feature requirements and verifying the expected output to the user.

Every team will own the API tests targeting their endpoint code ownership. Team-specific API test suites should run on every PR based on code changes, and all API Tests should run on the main development branch after a PR is merged ('post-merge').

If a test exercises an external dependency, it should be configured to run against a test or sandbox environment provided by the provider. If those are not available, the responses should be stubbed or mocked, so that the test is run against stable dependencies.

#### System Integration tests
Every external dependency endpoint requires and integration test that verifies that the request made to the dependency returns the expected result. 

Every team that owns code that has such integration will write tests that cover their use cases. These tests can run daily, and must be run after a release cut. Additionally, each dependency's tests must be configured to run on any version update to that dependency.

**Contract-style testing:** The above tests do not need to build the server and can be implemented with an API test framework. However, SWEs owning these tests and the API calls in the test must ensure that the fabricated test request is identical to the actual request made during the equivalent API test, and vice versa - the expected response from the dependency is identical to the response (sandbox, stub or mock) in the API test. The QE team will provide a framework that verifies this.

#### End-to-End Tests
The QE team will write and own E2E tests, which will be decided and agreed upon by Product Management. Typically these will be narrowed down to critical 'happy-path' use cases. 

These tests will run only on release branches and on the staging environment (see release process below). All dependencies will be exercised on their production endpoints.

### Perforance and Load Tests

The QE team will write and own performance and load tests. The benchmarks will be agreed upon by Product Management (e.g. based on peak user expectations for load and duration) and approved by DevOps.

These tests will run only on release branches and on the staging environment (see release process below). Dependency doubles will be stubbed, with spying enabled to verify the expected amount of outbound requests.

### Manual Tests

If there are any product requirements that cannot be tested programmatically, QE will author and execute manual tests. These should be treated as E2E tests and kept to a minimum.

QE and Product Management will agree on a "Smoke Suite" that will be executed manually on Production, periodically after each release. The tests in the suite should be revisited before each release based on risk and severity.

## Observability 

**Unit tests** will report to a dashboard that will track individual test flakiness and a breakdown of code coverage per team. A periodical report can be generated and shared from the dashboard.

**Performance and Load Tests** will report to a dashboard indicating the latest results as well as results from previous versions. A periodical report can be generated and shared from the dashboard.

Results of **Functional Tests** as well as the rest of the **Regression Tests** will be stored in a dashboard-ready database (e.g. BigQuery) that includes number of tests, run times, pass/fail, ownership and associated requirements broken down by test type and product version. Stakeholders can generate dashboards and/or subscribe to reports based on these parameters.

## Release Process 

The process to deploy a new version to production shall be as follows:

1. The process begins by cutting a release branch and tagging it with the next version. 
2. No feature changes or updates can be made to the release branch from this point without a Director-level approval. Any code that is not production-ready will be reverted.
3. Once all approved updates and all reverts have been merged, a full regression suite will be executed.
4. QE/ReleaseEng will triage any test failures and assign severity.
5. On-call SWE will fix or delegate to relevant SWE(s).
6. QE and Product Management will make an assessment as to which high-severity defects are considered release-blockers, taking into account the scope of work to fix and current release timeline.
7. Once all defects have been fixed, the build will be deployed to the Staging environment.
8. QE will perform E2E tests, Performance tests and manual tests (if needed). Other specific regression tests may be performed based on recent fixes and other risk factors.
9. Any defects found on Staging will revert the process back to step 4.
10. Once the build is "blessed" it can be deployed to production.
11. DevOps and QE will monitor the roll-out, and QE will perform a smoke suite. Both teams will alert if there are reasons for version rollback.

## Stakeholders 

**Main teams:**
- Quality Engineering
- Software Engineering
- Product Management

**Other teams:**
- DevOps (Performance Testing)
- Release Engineering, Director-levels (Release Process)


