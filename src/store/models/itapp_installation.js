// To parse this data:
//
//   const Convert = require("@/store/models/itapp_installation");
//
//   const installation = Convert.toInstallation(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

function toInstallation(json) {
  return cast(transformNulls(json), r('Installation'))
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
        // empty
      }
    }
    return invalidValue(typs, val)
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
    if (Object.getOwnPropertyNames(props).length === 3 && val === null) {
      val = {}
    }
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
    if (Object.keys(result).length === 3) {
      return result.id
    }
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

function transformNulls(json) {
  const mp = typeMap['Installation']['props']
  Object.keys(json).forEach(res => {
    if (typeof json[res] === 'object' && json[res] === null) {
      const unionMember = mp[mp.indexOf(
        mp.filter(e => e.json === res)[0]
      )]
      if (unionMember.typ.unionMembers.length === 3) {
        json[res] = {}
        typeMap[unionMember.typ.unionMembers[2].ref].props.forEach(mapItem => {
          json[res][mapItem.js] = mapItem.typ.unionMembers[1] === '' ? '' : undefined
        })
      }
    }
  })
  return json
}

function cast(val, typ) {
  return transform(val, typ, jsonToJSProps)
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
  'Installation': o([
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
      json: 'iconLink',
      js: 'iconLink',
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
      json: 'prefix',
      js: 'prefix',
      typ: u(undefined, u(null, ''))
    },
    {
      json: 'installation_attachment',
      js: 'installation_attachment',
      typ: u(undefined, null)
    },
    {
      json: 'installation_support',
      js: 'installation_support',
      typ: u(undefined, null, r('InstallationSupport'))
    },
    {
      json: 'installation_general',
      js: 'general_info',
      typ: u(undefined, null, r('InstallationGeneral'))
    },
    {
      json: 'installation_aditional_information',
      js: 'aditional_build_info',
      typ: u(undefined, null, r('InstallationAditionalInformation'))
    }
  ], false),
  'InstallationAditionalInformation': o([
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, 0)
    },
    {
      json: 'app_id',
      js: 'app_id',
      typ: u(undefined, 0)
    },
    {
      json: 'previous_software_version',
      js: 'previous_software_version',
      typ: u(undefined, '')
    },
    {
      json: 'groups_machine',
      js: 'groups_machine',
      typ: u(undefined, '')
    },
    {
      json: 'groups_user',
      js: 'groups_user',
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
    }
  ], false),
  'InstallationGeneral': o([
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, 0)
    },
    {
      json: 'app_id',
      js: 'app_id',
      typ: u(undefined, 0)
    },
    {
      json: 'priority',
      js: 'priority',
      typ: u(undefined, 0)
    },
    {
      json: 'odbc_connection_required',
      js: 'odbc_connection_required',
      typ: u(undefined, 0)
    },
    {
      json: 'odbc_contact_name',
      js: 'odbc_contact_name',
      typ: u(undefined, '')
    },
    {
      json: 'path_to_executable',
      js: 'path_to_executable',
      typ: u(undefined, '')
    },
    {
      json: 'odbc_settings',
      js: 'odbc_settings',
      typ: u(undefined, '')
    },
    {
      json: 'general_notes',
      js: 'general_notes',
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
      json: 'install_type',
      js: 'install_type',
      typ: u(undefined, 0, r('ItSettings'))
    },
    {
      json: 'ldap_ad_authentication',
      js: 'ldap_ad_authentication',
      typ: u(undefined, 0, r('ItSettings'))
    },
    {
      json: 'windows_passed_dct',
      js: 'windows_passed_dct',
      typ: u(undefined, 0, r('ItSettings'))
    },
    {
      json: 'delivery_method',
      js: 'delivery_method',
      typ: u(undefined, 0, r('ItSettings'))
    }
  ], false),
  'InstallationSupport': o([
    {
      json: 'id',
      js: 'id',
      typ: u(undefined, 0)
    },
    {
      json: 'app_id',
      js: 'app_id',
      typ: u(undefined, 0)
    },
    {
      json: 'firewall_exceptions',
      js: 'firewall_exceptions',
      typ: u(undefined, 0)
    },
    {
      json: 'firewall_exceptions_note',
      js: 'firewall_exceptions_note',
      typ: u(undefined, '')
    },
    {
      json: 'install_notes',
      js: 'install_notes',
      typ: u(undefined, 0)
    },
    {
      json: 'install_notes_note',
      js: 'install_notes_note',
      typ: u(undefined, '')
    },
    {
      json: 'mapped_drives',
      js: 'mapped_drives',
      typ: u(undefined, 0)
    },
    {
      json: 'mapped_drives_note',
      js: 'mapped_drives_note',
      typ: u(undefined, '')
    },
    {
      json: 'registry_changes',
      js: 'registry_changes',
      typ: u(undefined, 0)
    },
    {
      json: 'registry_changes_note',
      js: 'registry_changes_note',
      typ: u(undefined, '')
    },
    {
      json: 'antivirus_exclusion',
      js: 'antivirus_exclusion',
      typ: u(undefined, 0)
    },
    {
      json: 'antivirus_exclusion_note',
      js: 'antivirus_exclusion_note',
      typ: u(undefined, '')
    },
    {
      json: 'ini_changes',
      js: 'ini_changes',
      typ: u(undefined, 0)
    },
    {
      json: 'ini_changes_note',
      js: 'ini_changes_note',
      typ: u(undefined, '')
    },
    {
      json: 'shortcut_modifications',
      js: 'shortcut_modifications',
      typ: u(undefined, 0)
    },
    {
      json: 'shortcut_modifications_note',
      js: 'shortcut_modifications_note',
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
    }
  ], false),
  'ItSettings': o([
    { json: 'id', js: 'id', typ: u(undefined, 0) },
    { json: 'value', js: 'value', typ: u(undefined, '') },
    { json: 'field', js: 'field', typ: u(undefined, '') }
  ], false)
}

module.exports = {
  'toInstallation': toInstallation
}
