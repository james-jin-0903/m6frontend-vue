// To parse this data:
//
//   const Convert = require("./file");
//
//   const notifications = Convert.toNotifications(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
function toNotifications(json) {
  return cast(JSON.parse(json), a(r('Notifications')))
}

function notificationsToJson(value) {
  return JSON.stringify(uncast(value, a(r('Notifications'))), null, 2)
}

function invalidValue(typ, val, key = '') {
  if (key) {
    throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`)
  }
  throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`)
}

function jsonToJSProps(typ) {
  if (typ.jsonToJS === undefined) {
    const map = {}
    typ.props.forEach(p => map[p.json] = { key: p.js, typ: p.typ })
    typ.jsonToJS = map
  }
  return typ.jsonToJS
}

function jsToJSONProps(typ) {
  if (typ.jsToJSON === undefined) {
    const map = {}
    typ.props.forEach(p => map[p.js] = { key: p.json, typ: p.typ })
    typ.jsToJSON = map
  }
  return typ.jsToJSON
}

function transform(val, typ, getProps, key = '') {
  function transformPrimitive(typ, val) {
    if (typeof typ === typeof val) return val
    return invalidValue(typ, val, key)
  }

  function transformUnion(typs, val) {
    // val must validate against one typ in typs
    const l = typs.length
    for (let i = 0; i < l; i++) {
      const typ = typs[i]
      try {
        return transform(val, typ, getProps)
      } catch (_) {
        //   Empty
      }
    }
    return invalidValue(typs, val)
  }

  function transformEnum(cases, val) {
    if (cases.indexOf(val) !== -1) return val
    return invalidValue(cases, val)
  }

  function transformArray(typ, val) {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue('array', val)
    return val.map(el => transform(el, typ, getProps))
  }

  function transformDate(val) {
    if (val === null) {
      return null
    }
    const d = new Date(val)
    if (isNaN(d.valueOf())) {
      return invalidValue('Date', val)
    }
    return d
  }

  function transformObject(props, additional, val) {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue('object', val)
    }
    const result = {}
    Object.getOwnPropertyNames(props).forEach(key => {
      const prop = props[key]
      const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined
      result[prop.key] = transform(v, prop.typ, getProps, prop.key)
    })
    Object.getOwnPropertyNames(val).forEach(key => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key)
      }
    })
    return result
  }

  if (typ === 'any') return val
  if (typ === null) {
    if (val === null) return val
    return invalidValue(typ, val)
  }
  if (typ === false) return invalidValue(typ, val)
  while (typeof typ === 'object' && typ.ref !== undefined) {
    typ = typeMap[typ.ref]
  }
  if (Array.isArray(typ)) return transformEnum(typ, val)
  if (typeof typ === 'object') {
    return {}.hasOwnProperty.call(typ, 'unionMembers') ? transformUnion(typ.unionMembers, val)
      : {}.hasOwnProperty.call(typ, 'arrayItems') ? transformArray(typ.arrayItems, val)
        : {}.hasOwnProperty.call(typ, 'props') ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val)
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val)
  return transformPrimitive(typ, val)
}

function cast(val, typ) {
  return transform(val, typ, jsonToJSProps)
}

function uncast(val, typ) {
  return transform(val, typ, jsToJSONProps)
}

function a(typ) {
  return { arrayItems: typ }
}

function u(...typs) {
  return { unionMembers: typs }
}

function o(props, additional) {
  return { props, additional }
}

function r(name) {
  return { ref: name }
}

const typeMap = {
  'Notifications': o([
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, 0)
    },
    {
      json: 'title',
      js: 'title',
      typ: u(undefined, '')
    },
    {
      json: 'description',
      js: 'description',
      typ: u(undefined, '')
    },
    {
      json: 'author',
      js: 'author',
      typ: u(undefined, '')
    },
    {
      json: 'application_id',
      js: 'application_id',
      typ: u(undefined, null)
    },
    {
      json: 'status',
      js: 'status',
      typ: u(undefined, 0)
    },
    {
      json: 'request_type',
      js: 'request_type',
      typ: u(undefined, 0)
    },
    {
      json: 'start_date',
      js: 'start_date',
      typ: u(undefined, Date)
    },
    {
      json: 'due_date',
      js: 'due_date',
      typ: u(undefined, Date)
    },
    {
      json: 'end_date',
      js: 'end_date',
      typ: u(undefined, Date)
    },
    {
      json: 'post_id',
      js: 'post_id',
      typ: u(undefined, '')
    },
    {
      json: 'created_at',
      js: 'created_at',
      typ: u(undefined, Date)
    },
    {
      json: 'updated_at',
      js: 'updated_at',
      typ: u(undefined, Date)
    },
    {
      json: 'post',
      js: 'post',
      typ: u(undefined, a(r('Post')))
    },
    {
      json: 'wo_assignments',
      js: 'wo_assignments',
      typ: u(undefined, a(r('Assignments')))
    },
    {
      json: 'record',
      js: 'record',
      typ: u(undefined, r('Record'))
    }
  ], false),
  'Post': o([
    {
      json: 'actor',
      js: 'actor',
      typ: u(undefined, '')
    },
    {
      json: 'foreign_id',
      js: 'foreign_id',
      typ: u(undefined, '')
    },
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, '')
    },
    {
      json: 'images',
      js: 'images',
      typ: u(undefined, a('any'))
    },
    {
      json: 'message',
      js: 'message',
      typ: u(undefined, '')
    },
    {
      json: 'object',
      js: 'object',
      typ: u(undefined, '')
    },
    {
      json: 'origin',
      js: 'origin',
      typ: u(undefined, null)
    },
    {
      json: 'reaction_counts',
      js: 'reaction_counts',
      typ: u(undefined, r('Counts'))
    },
    {
      json: 'target',
      js: 'target',
      typ: u(undefined, '')
    },
    {
      json: 'time',
      js: 'time',
      typ: u(undefined, Date)
    },
    {
      json: 'verb',
      js: 'verb',
      typ: u(undefined, '')
    }
  ], false),
  'Counts': o([
    {
      json: 'comment',
      js: 'comment',
      typ: u(undefined, 0)
    },
    {
      json: 'like',
      js: 'like',
      typ: u(undefined, 0)
    }
  ], false),
  'Record': o([
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, 0)
    },
    {
      json: 'app_number',
      js: 'app_number',
      typ: u(undefined, '')
    },
    {
      json: 'app_type',
      js: 'app_type',
      typ: u(undefined, '')
    },
    {
      json: 'title',
      js: 'title',
      typ: u(undefined, '')
    },
    {
      json: 'author',
      js: 'author',
      typ: u(undefined, '')
    },
    {
      json: 'description',
      js: 'description',
      typ: u(undefined, '')
    }
  ], false),
  'Assignments': o([
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, 0)
    },
    {
      json: 'work_id',
      js: 'work_id',
      typ: u(undefined, 0)
    },
    {
      json: 'assignee',
      js: 'assignee',
      typ: u(undefined, '')
    },
    {
      json: 'status',
      js: 'status',
      typ: u(undefined, 0)
    },
    {
      json: 'created_at',
      js: 'created_at',
      typ: u(undefined, Date)
    },
    {
      json: 'updated_at',
      js: 'updated_at',
      typ: u(undefined, Date)
    }
  ], false)
}

module.exports = {
  'notificationsToJson': notificationsToJson,
  'toNotifications': toNotifications
}
