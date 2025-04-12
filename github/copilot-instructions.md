# AI Rules for {{project-name}}

{{project-description}}

## FRONTEND

### Guidelines for REACT

#### NEXT_JS

- Use App Router and Server Components for improved performance and SEO
- Implement route handlers for API endpoints instead of the pages/api directory
- Use server actions for form handling and data mutations from Server Components
- Leverage Next.js Image component with proper sizing for core web vitals optimization
- Implement the Metadata API for dynamic SEO optimization
- Use React Server Components for {{data_fetching_operations}} to reduce client-side JavaScript
- Implement Streaming and Suspense for improved loading states
- Use the new Link component without requiring a child <a> tag
- Leverage parallel routes for complex layouts and parallel data fetching
- Implement intercepting routes for modal patterns and nested UIs

#### ZUSTAND

- Create separate stores for distinct state domains instead of one large store
- Use immer middleware for complex state updates to maintain immutability when dealing with nested data
- Implement selectors to derive state and prevent unnecessary re-renders
- Leverage the persist middleware for automatic state persistence in localStorage or other storage
- Use TypeScript with strict typing for store definitions to catch errors at compile time
- Prefer shallow equality checks with useShallow for performance optimization in component re-renders
- Combine stores using composition for sharing logic between stores
- Implement subscriptions to react to state changes outside of React components
- Use devtools middleware for Redux DevTools integration in development
- Create custom hooks to encapsulate store access and related business logic

#### REACT_QUERY

- Use TanStack Query (formerly React Query) with appropriate staleTime and gcTime based on data freshness requirements
- Implement the useInfiniteQuery hook for pagination and infinite scrolling
- Use optimistic updates for mutations to make the UI feel more responsive
- Leverage queryClient.setQueryDefaults to establish consistent settings for query categories
- Use suspense mode with <Suspense> boundaries for a more declarative data fetching approach
- Implement retry logic with custom backoff algorithms for transient network issues
- Use the select option to transform and extract specific data from query results
- Implement mutations with onMutate, onError, and onSettled for robust error handling
- Use Query Keys structuring pattern ([entity, params]) for better organization and automatic refetching
- Implement query invalidation strategies to keep data fresh after mutations


### Guidelines for STYLING

#### TAILWIND

- Use the @layer directive to organize styles into components, utilities, and base layers
- Implement Just-in-Time (JIT) mode for development efficiency and smaller CSS bundles
- Use arbitrary values with square brackets (e.g., w-[123px]) for precise one-off designs
- Leverage the @apply directive in component classes to reuse utility combinations
- Implement the Tailwind configuration file for customizing theme, plugins, and variants
- Use component extraction for repeated UI patterns instead of copying utility classes
- Leverage the theme() function in CSS for accessing Tailwind theme values
- Implement dark mode with the dark: variant
- Use responsive variants (sm:, md:, lg:, etc.) for adaptive designs
- Leverage state variants (hover:, focus:, active:, etc.) for interactive elements


### Guidelines for ACCESSIBILITY

#### WCAG_PERCEIVABLE

- Provide text alternatives for non-text content including images, icons, and graphics with appropriate alt attributes
- Ensure pre-recorded audio-visual content has captions, audio descriptions, and transcripts for {{media_content}}
- Maintain minimum contrast ratios of 4.5:1 for normal text and 3:1 for large text and UI components
- Enable content to be presented in different ways without losing information or structure when zoomed or resized
- Avoid using color alone to convey information; pair with text, patterns, or icons for {{status_indicators}}
- Provide controls to pause, stop, or hide any moving, blinking, or auto-updating content
- Ensure text can be resized up to 200% without loss of content or functionality in {{responsive_layouts}}
- Use responsive design that adapts to different viewport sizes and zoom levels without horizontal scrolling
- Enable users to customize text spacing (line height, paragraph spacing, letter/word spacing) without breaking layouts

#### WCAG_OPERABLE

- Make all functionality accessible via keyboard with visible focus indicators for {{interactive_elements}}
- Avoid keyboard traps where focus cannot move away from a component via standard navigation
- Provide mechanisms to extend, adjust, or disable time limits if present in {{timed_interactions}}
- Avoid content that flashes more than three times per second to prevent seizure triggers
- Implement skip navigation links to bypass blocks of repeated content across pages
- Use descriptive page titles, headings, and link text that indicate purpose and destination
- Ensure focus order matches the visual and logical sequence of information presentation
- Support multiple ways to find content (search, site map, logical navigation hierarchy)
- Allow pointer gesture actions to be accomplished with a single pointer without path-based gestures
- Implement pointer cancellation to prevent unintended function activation, especially for {{critical_actions}}

#### WCAG_UNDERSTANDABLE

- Specify the human language of the page and any language changes using lang attributes
- Ensure components with the same functionality have consistent identification and behavior across {{application_sections}}
- Provide clear labels, instructions, and error messages for user inputs and {{form_elements}}
- Implement error prevention for submissions with legal or financial consequences (confirmation, review, undo)
- Make navigation consistent across the site with predictable patterns for menus and interactive elements
- Ensure that receiving focus or changing settings does not automatically trigger unexpected context changes
- Design context-sensitive help for complex interactions including validated input formats
- Use clear language and define unusual terms, abbreviations, and jargon for {{domain_specific_content}}
- Provide visual and programmatic indication of current location within navigation systems

#### WCAG_ROBUST

- Use valid, well-formed markup that follows HTML specifications for {{document_structure}}
- Provide name, role, and value information for all user interface components
- Ensure custom controls and interactive elements maintain compatibility with assistive technologies
- Implement status messages that can be programmatically determined without receiving focus
- Use semantic HTML elements that correctly describe the content they contain (buttons, lists, headings, etc.)
- Validate code against technical specifications to minimize compatibility errors
- Test with multiple browsers and assistive technologies for cross-platform compatibility
- Avoid deprecated HTML elements and attributes that may not be supported in future technologies

#### ARIA

- Use ARIA landmarks to identify regions of the page (main, navigation, search, etc.)
- Apply appropriate ARIA roles to custom interface elements that lack semantic HTML equivalents
- Set aria-expanded and aria-controls for expandable content like accordions and dropdowns
- Use aria-live regions with appropriate politeness settings for dynamic content updates
- Implement aria-hidden to hide decorative or duplicative content from screen readers
- Apply aria-label or aria-labelledby for elements without visible text labels
- Use aria-describedby to associate descriptive text with form inputs or complex elements
- Implement aria-current for indicating the current item in a set, navigation, or process
- Avoid redundant ARIA that duplicates the semantics of native HTML elements
- Apply aria-invalid and appropriate error messaging for form validation in {{form_validation}}

#### ACCESSIBILITY_TESTING

- Test keyboard navigation to verify all interactive elements are operable without a mouse
- Verify screen reader compatibility with NVDA, JAWS, and VoiceOver for {{critical_user_journeys}}
- Use automated testing tools like Axe, WAVE, or Lighthouse to identify common accessibility issues
- Check color contrast using tools like Colour Contrast Analyzer for all text and UI components
- Test with page zoomed to 200% to ensure content remains usable and visible
- Perform manual accessibility audits using WCAG 2.2 checklist for key user flows
- Test with voice recognition software like Dragon NaturallySpeaking for voice navigation
- Validate form inputs have proper labels, instructions, and error handling mechanisms
- Conduct usability testing with disabled users representing various disability types
- Implement accessibility unit tests for UI components to prevent regression


## DATABASE

### Guidelines for SQL

#### POSTGRES

- Use connection pooling to manage database connections efficiently
- Implement JSONB columns for semi-structured data instead of creating many tables for {{flexible_data}}
- Use materialized views for complex, frequently accessed read-only data


## DEVOPS

### Guidelines for CI_CD

#### GITHUB_ACTIONS

- Check if `package.json` exists in project root and summarize key scripts
- Check if `.nvmrc` exists in project root
- Check if `.env.example` exists in project root to identify key `env:` variables
- Always use terminal command: `git branch -a | cat` to verify whether we use `main` or `master` branch
- Always use `env:` variables and secrets attached to jobs instead of global workflows
- Always use `npm ci` for Node-based dependency setup
- Extract common steps into composite actions in separate files
- Once you're done, as a final step conduct the following: for each public action always use <tool>"Run Terminal"</tool> to see what is the most up-to-date version (use only major version) - extract tag_name from the response:
- ```bash curl -s https://api.github.com/repos/{owner}/{repo}/releases/latest ```


### Guidelines for CONTAINERIZATION

#### DOCKER

- Use multi-stage builds to create smaller production images
- Implement layer caching strategies to speed up builds for {{dependency_types}}
- Use non-root users in containers for better security


## TESTING

### Guidelines for UNIT

#### VITEST

- Leverage the `vi` object for test doubles - Use `vi.fn()` for function mocks, `vi.spyOn()` to monitor existing functions, and `vi.stubGlobal()` for global mocks. Prefer spies over mocks when you only need to verify interactions without changing behavior.
- Master `vi.mock()` factory patterns - Place mock factory functions at the top level of your test file, return typed mock implementations, and use `mockImplementation()` or `mockReturnValue()` for dynamic control during tests. Remember the factory runs before imports are processed.
- Create setup files for reusable configuration - Define global mocks, custom matchers, and environment setup in dedicated files referenced in your `vitest.config.ts`. This keeps your test files clean while ensuring consistent test environments.
- Use inline snapshots for readable assertions - Replace complex equality checks with `expect(value).toMatchInlineSnapshot()` to capture expected output directly in your test file, making changes more visible in code reviews.
- Monitor coverage with purpose and only when asked - Configure coverage thresholds in `vitest.config.ts` to ensure critical code paths are tested, but focus on meaningful tests rather than arbitrary coverage percentages.
- Make watch mode part of your workflow - Run `vitest --watch` during development for instant feedback as you modify code, filtering tests with `-t` to focus on specific areas under development.
- Explore UI mode for complex test suites - Use `vitest --ui` to visually navigate large test suites, inspect test results, and debug failures more efficiently during development.
- Handle optional dependencies with smart mocking - Use conditional mocking to test code with optional dependencies by implementing `vi.mock()` with the factory pattern for modules that might not be available in all environments.
- Configure jsdom for DOM testing - Set `environment: 'jsdom'` in your configuration for frontend component tests and combine with testing-library utilities for realistic user interaction simulation.
- Structure tests for maintainability - Group related tests with descriptive `describe` blocks, use explicit assertion messages, and follow the Arrange-Act-Assert pattern to make tests self-documenting.
- Leverage TypeScript type checking in tests - Enable strict typing in your tests to catch type errors early, use `expectTypeOf()` for type-level assertions, and ensure mocks preserve the original type signatures.


### Guidelines for E2E

#### PLAYWRIGHT

- Initialize configuration only with Chromium/Desktop Chrome browser
- Use browser contexts for isolating test environments
- Implement the Page Object Model for maintainable tests
- Use locators for resilient element selection
- Leverage API testing for backend validation
- Implement visual comparison with expect(page).toHaveScreenshot()
- Use the codegen tool for test recording
- Leverage trace viewer for debugging test failures
- Implement test hooks for setup and teardown
- Use expect assertions with specific matchers
- Leverage parallel execution for faster test runs


## CODING_PRACTICES

### Guidelines for DOCUMENTATION

#### STORYBOOK

- Organize stories by component hierarchy to mirror the application structure
- Implement comprehensive controls to showcase component variations for {{component_types}}
- Use MDX format to combine documentation and live examples for complex components
- Configure Storybook addons for accessibility, responsive design, and {{specific_testing_needs}}
- Implement design token integration to showcase components with different themes
- Create interaction tests to verify component behavior in addition to visual appearance


### Guidelines for VERSION_CONTROL

#### GITHUB

- Use pull request templates to standardize information provided for code reviews
- Implement branch protection rules for {{protected_branches}} to enforce quality checks
- Configure required status checks to prevent merging code that fails tests or linting
- Use GitHub Actions for CI/CD workflows to automate testing and deployment
- Implement CODEOWNERS files to automatically assign reviewers based on code paths
- Use GitHub Projects for tracking work items and connecting them to code changes


### Guidelines for SUPPORT_LEVEL

#### SUPPORT_BEGINNER

- When running in agent mode, execute up to 3 actions at a time and ask for approval or course correction afterwards.
- Write code with clear variable names and include explanatory comments for non-obvious logic. Avoid shorthand syntax and complex patterns.
- Provide full implementations rather than partial snippets. Include import statements, required dependencies, and initialization code.
- Add defensive coding patterns and clear error handling. Include validation for user inputs and explicit type checking.
- Suggest simpler solutions first, then offer more optimized versions with explanations of the trade-offs.
- Briefly explain why certain approaches are used and link to relevant documentation or learning resources.
- When suggesting fixes for errors, explain the root cause and how the solution addresses it to build understanding. Ask for confirmation before proceeding.
- Offer introducing basic test cases that demonstrate how the code works and common edge cases to consider.


### Guidelines for STATIC_ANALYSIS

#### ESLINT

- Configure project-specific rules in eslint.config.js to enforce consistent coding standards
- Use shareable configs like eslint-config-airbnb or eslint-config-standard as a foundation
- Implement custom rules for {{project_specific_patterns}} to maintain codebase consistency
- Configure integration with Prettier to avoid rule conflicts for code formatting
- Use the --fix flag in CI/CD pipelines to automatically correct fixable issues
- Implement staged linting with husky and lint-staged to prevent committing non-compliant code

#### PRETTIER

- Define a consistent .prettierrc configuration across all {{project_repositories}}
- Configure editor integration to format on save for immediate feedback
- Use .prettierignore to exclude generated files, build artifacts, and {{specific_excluded_patterns}}
- Set printWidth based on team preferences (80-120 characters) to improve code readability
- Configure consistent quote style and semicolon usage to match team conventions
- Implement CI checks to ensure all committed code adheres to the defined style


