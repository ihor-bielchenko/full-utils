# full-utils
Lightweight, dependency-free collection of pure TypeScript/JavaScript utility functions for everyday development.
It’s designed to be clear, fast, and easy to use — both in Node.js and in browser environments.

Whether you work with strings, numbers, dates, IPs, JSON, arrays, or type checks, this package provides you with a well-documented, consistent, and predictable API.

## Installation
```bash
# with npm
npm install full-utils

# or with yarn
yarn add full-utils

# or with pnpm
pnpm add full-utils

```
## Works in:
- Node.js (CommonJS & ESM)
- Browser / Front-end
- TypeScript or plain JavaScript

## Concept

full-utils follows a simple philosophy:
Small, pure, and type-safe utilities — reusable across any kind of project, from scripts to large applications.

All functions:
- Are pure (no side effects)
- Include TypeScript typings
- Have clear naming
- Are documented via TypeDoc
- Work without any external dependencies

## Documentation
Full API documentation:
- full-utils.docs.ihor.bielchenko.com

## Quick Example
```javascript
import { isStrFilled, formatDateToString, rangeIPv4 } from 'full-utils';

// Check if a string has content
console.log(isStrFilled('Hello')); // true

// Format current date as 'YYYY-MM-DD HH:mm:ss'
console.log(formatDateToString(new Date()));

// Generate all IPs in a range
for (const ip of rangeIPv4('192.168.0.1', '192.168.0.5')) {
  console.log(ip);
}

```

## Modules Overview
### Number utilities (/num)
Work with numbers precisely — including BigInt-based fixed decimals.

| Function                                  | Description                                                |
| ----------------------------------------- | ---------------------------------------------------------- |
| `formatToNum`                             | Parse strings/numbers to normalized numeric values.        |
| `parseToFixedDecimal`                     | Convert any input to a precise fixed-decimal structure.    |
| `roundFixedDecimal`                       | Round a fixed-decimal number using half-up or trunc modes. |
| `convertExponentialToParts`               | Convert exponential notation into decimal components.      |
| `fixedDecimalToNum` / `fixedDecimalToStr` | Convert precise decimals to number or string.              |
| `changeFixedDecimalScale`                 | Increase or decrease the scale of a fixed decimal.         |

### Date utilities (/date)
| Function                            | Description                                             |
| ----------------------------------- | ------------------------------------------------------- |
| `floorDateToMinutes`                | Floor date to the nearest time step (e.g. every 5 min). |
| `formatDateToString`                | Convert a Date to `'YYYY-MM-DD HH:mm:ss'` string.       |
| `secondsToParts` / `partsToSeconds` | Convert between seconds and time components.            |

### IP utilities (/ip-addr)
| Function                      | Description                                         |
| ----------------------------- | --------------------------------------------------- |
| `parseIPv4` / `toIPv4`        | Parse or format IPv4 addresses.                     |
| `cidrToRange`                 | Convert a CIDR (e.g. `192.168.0.0/24`) to IP range. |
| `rangeIPv4`                   | Generate an iterator of IP addresses in range.      |
| `rangeIPv4ToArr`              | Materialize the range as an array.                  |
| `ipAddrToNum` / `numToIpAddr` | Convert between IPv4 and integer.                   |

### Type & Value checkers (/is)
Simple and strict predicates like isStr, isNum, isObjFilled, isFunc, etc.

| Function                                   | Checks if...                                  |
| ------------------------------------------ | --------------------------------------------- |
| `isStr`, `isStrFilled`                     | Value is a string (optionally non-empty).     |
| `isNum`, `isNumP`, `isNumNZ`, `isNumFloat` | Numeric type and positivity/zero constraints. |
| `isArr`, `isArrFilled`                     | Array exists and optionally has elements.     |
| `isBool`, `isStrBool`                      | Boolean or boolean-like string.               |
| `isIpAddr`, `isMacAddr`                    | Valid network address formats.                |
| `isObj`, `isObjFilled`                     | Object is plain and not empty.                |
| `isFunc`, `isVar`                          | Function or valid variable identifier.        |
| `isEmail`, `isPhone`, `isPassword`         | Common data validation helpers.               |

### Array utilities (/arr)
| Function              | Description                                        |
| --------------------- | -------------------------------------------------- |
| `formatStrToFuncArgs` | Convert a comma-separated string to argument list. |
| `splitArrToPortions`  | Split large arrays into chunks of fixed size.      |

### String utilities (/str)
| Function                            | Description                              |
| ----------------------------------- | ---------------------------------------- |
| `formatToTrim`                      | Trim string safely.                      |
| `formatToLowerCase`                 | Lowercase string safely.                 |
| `formatToPhone`                     | Normalize to international phone format. |
| `formatToNull`, `formatToUndefined` | Convert empty strings to null/undefined. |

### Common utilities (/common)
| Function | Description                                            |
| -------- | ------------------------------------------------------ |
| `wait`   | Pause execution asynchronously for given milliseconds. |

Example:
```javascript
await wait(500); // waits for 0.5 seconds
```

### Network utilities (/net)

Node-only helpers for TCP connections.
| Function                         | Description                                  |
| -------------------------------- | -------------------------------------------- |
| `netTCP(message, host, options)` | Send a TCP message and receive the response. |

Supports:
- Timeout controls (timeoutMs, connectTimeoutMs)
- Safe abort via AbortSignal
- Line terminator (\n / \r\n)
- Max bytes and half-close options. 
- Available only in Node.js builds (import from 'full-utils/node')

### URL & Host (/url)
| Function      | Description                                    |
| ------------- | ---------------------------------------------- |
| `extractHost` | Extract clean hostname from URL or raw string. |

### JSON utilities (/json)
| Function                    | Description                                             |
| --------------------------- | ------------------------------------------------------- |
| `jsonEncode` / `jsonDecode` | Safe JSON (de)serialization.                            |
| `tryParseJSON`              | Try parsing with graceful fallback.                     |
| `parseStringLike`           | Parse non-strict JSON-like strings (with quotes, etc.). |

### Units (/units)
| Function                | Description                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| `toH` / `toGH` / `toGB` | Convert numeric values to readable units (hours, gigahash, gigabyte). |

## Importing by environment
For Node.js:
```javascript
import * from 'full-utils/node';

```

For Browser / universal code:
```javascript
import * from 'full-utils/browser';

```

Or use tree-shakable imports directly from the source root:
```javascript
import { formatDateToString, isStrFilled } from 'full-utils';

```

## TypeScript Ready
Every function is strongly typed and documented.
You’ll get autocompletion, inline JSDoc, and type inference automatically.

## Versioning
Follows semantic versioning (MAJOR.MINOR.PATCH).
Breaking changes are always reflected in a major version bump

## License
Use freely in your own projects. Add proper notices if you publish a package (MIT/Apache-2.0, etc.).

## Summary

full-utils gives you many of ready-to-use, predictable, and documented helpers
that you can safely use in any project, no matter how large or small.

One toolkit. Zero dependencies. Full control.
