---
title: Creating Turnin Dropboxes on the Bellagio Server
date: 2025-10-08
---

# Creating Turnin Dropboxes on the Bellagio Server

## Using the ``mkassign`` command

1. After signing in to the Bellagio server, use the ``astyle`` command:

    ``` 
    $ mkassign
    ```

2. Fill in the requested details:

    ```bash
    $ mkassign
    Enter course identifier (e.g., cs135, cs202-1001): {{cs135_4203}}
    Enter project identifier (e.g., pa02, lab03b, exam1): {{lab06b}}
    Enter closing date (yyyy-mm-dd): {{2025-04-04}}
    Enter closing time (hh:mm, 24-hour format): {{00:04}}
    Enter project description (e.g., 'Generate sales report'): {{Void Functions Lab}}
    ```

    > NOTE: These will appear one at a time rather than all at once.

3. If all details are accurate, user will see the following terminal output:

    ```
    Successfully created the project {{lab06b}} in the course {{cs135_4203}}.
    Project will be disabled at {{00:04}} on {{2025-04-04}}
    ```
