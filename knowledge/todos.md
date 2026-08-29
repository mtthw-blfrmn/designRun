# designRun To‑Dos

This file is the durable source for the control center's To‑Do area. The app and the `todo-extractor` skill preserve the JSON shape below.

```json
{
  "version": 1,
  "todos": [
    {
      "id": "sample-relay-review-offline-recovery",
      "title": "Review offline recovery before outreach launch",
      "description": "Sample task — verify that a coordinator can recover imported audience work after connectivity is interrupted.",
      "project": "relay-sample",
      "type": "explicit",
      "owner": "agent",
      "dueDate": "",
      "size": 2,
      "urgency": "high",
      "completed": false,
      "createdAt": "2026-08-28T19:00:00Z",
      "updatedAt": "2026-08-28T19:00:00Z"
    },
    {
      "id": "sample-relay-map-import-state",
      "title": "Map audience import states",
      "description": "Sample task — connect the import state model to the Outreach Workspace PRD.",
      "project": "relay-sample",
      "type": "inferred",
      "owner": "agent",
      "dueDate": "",
      "size": 1,
      "urgency": "medium",
      "completed": true,
      "createdAt": "2026-08-28T19:00:00Z",
      "updatedAt": "2026-08-28T20:00:00Z"
    }
  ]
}
```

The two records above are synthetic examples tied to `projects/relay-sample/`. Remove them when you remove the sample project or replace this array with your own tasks.
