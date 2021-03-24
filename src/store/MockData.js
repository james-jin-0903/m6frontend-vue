const wi = "1280";
const le = "1280";

const Rationalization = {
  Attributes: () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Rationalization/Attributes"),
  Costs: () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Rationalization/Costs"),
  FTE: () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Rationalization/FTE"),
  Governance: () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Rationalization/Governance"),
  License: () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Rationalization/License"),
  Users: () => import("@/components/RecordMode/RecordComponents/RecordType/ITApps/Rationalization/Users")
}

export default {
  fake_records: [
    {
      record_type: "project",
      record_name: "Las asd",
      uid: "1123",
      phase: "asdasd",
      company: "m6connect",
      department: "Design",
      record_leader: "",
      record_support: "",
      designer: "",
      role_two: "",
      client_status: "",
      internal_description: "",
      internal_objective: "",
      record_image_url:
        "https://picsum.photos/" + wi + "/" + le + "?nocache=" + Math.random(),
      client_original_request: "",
      client_requested_due_date: "",
      client_in_take_clarification_description: "",
      client_follow_up_date: "",
      image_url_type: "record_image_url"
    },{
      record_type: "project",
      record_name: "Lead Plutonium",
      uid: "234123",
      phase: "asdasd",
      company: "m6connect",
      department: "Design",
      record_leader: "",
      record_support: "",
      designer: "",
      role_two: "",
      client_status: "",
      internal_description: "",
      internal_objective: "",
      record_image_url:
        "https://picsum.photos/" + wi + "/" + le + "?nocache=" + Math.random(),
      client_original_request: "",
      client_requested_due_date: "",
      client_in_take_clarification_description: "",
      client_follow_up_date: "",
      image_url_type: "record_image_url"
    },{
      record_type: "project",
      record_name: "Deni alegar",
      uid: "31234",
      phase: "asdasd",
      company: "m6connect",
      department: "Design",
      record_leader: "",
      record_support: "",
      designer: "",
      role_two: "",
      client_status: "",
      internal_description: "",
      internal_objective: "",
      record_image_url:
        "https://picsum.photos/" + wi + "/" + le + "?nocache=" + Math.random(),
      client_original_request: "",
      client_requested_due_date: "",
      client_in_take_clarification_description: "",
      client_follow_up_date: "",
      image_url_type: "record_image_url"
    },{
      record_type: "project",
      record_name: "Art effect",
      uid: "4123123",
      phase: "asdasd",
      company: "m6connect",
      department: "Design",
      record_leader: "",
      record_support: "",
      designer: "",
      role_two: "",
      client_status: "",
      internal_description: "",
      internal_objective: "",
      record_image_url:
        "https://picsum.photos/" + wi + "/" + le + "?nocache=" + Math.random(),
      client_original_request: "",
      client_requested_due_date: "",
      client_in_take_clarification_description: "",
      client_follow_up_date: "",
      image_url_type: "record_image_url"
    },{
      record_type: "itapps",
      record_name: "Citrix Workspace",
      uid: "1123",
      phase: "asdasd",
      company: "3DR Labs II, LLC",
      department: "Design",
      category: "Labor and Delivery",
      sub_category: "",
      app_management: "Sharp Managed",
      hosting_model: "Sharp Hosted",
      first_contact_group: "AMBULATORY COMMUNITY SYSTEMS SUPPORT",
      record_leader: "",
      record_support: "",
      designer: "",
      role_two: "",
      client_status: "Active",
      version: "1912 LTSR",
      aka: ['Citrix', 'CWSAC', 'Workspace'],
      fka: ['Citrix Workspace Formerly'],
      facing: true,
      phi: false,
      pci: true,
      ssn: 'Fully Masked',
      internal_description: "",
      internal_objective: "this is the space for the citrix company description",
      record_image_url:
        "https://picsum.photos/" + wi + "/" + le + "?nocache=" + Math.random(),
      client_original_request: "",
      client_requested_due_date: "",
      client_in_take_clarification_description: "",
      client_follow_up_date: "",
      image_url_type: "record_image_url"
    },{
      record_type: "itapps",
      record_name: "Test ITApps",
      uid: "1123",
      phase: "asdasd",
      company: "3DR Labs II, LLC",
      department: "Design",
      category: "Labor and Delivery",
      sub_category: "",
      app_management: "Sharp Managed",
      hosting_model: "Sharp Hosted",
      first_contact_group: "AMBULATORY COMMUNITY SYSTEMS SUPPORT",
      record_leader: "",
      record_support: "",
      designer: "",
      role_two: "",
      client_status: "Active",
      version: "1912 LTSR",
      aka: ['Citrix', 'CWSAC', 'Workspace'],
      fka: ['Citrix Workspace Formerly'],
      facing: true,
      phi: false,
      pci: true,
      ssn: 'Fully Masked',
      internal_description: "",
      internal_objective: "this is the space for the citrix company description",
      record_image_url:
        "https://picsum.photos/" + wi + "/" + le + "?nocache=" + Math.random(),
      client_original_request: "",
      client_requested_due_date: "",
      client_in_take_clarification_description: "",
      client_follow_up_date: "",
      image_url_type: "record_image_url"
    },{
      record_type: "itapps",
      record_name: "Test ITApps 2",
      uid: "1123",
      phase: "asdasd",
      company: "3DR Labs II, LLC",
      department: "Design",
      category: "Labor and Delivery",
      sub_category: "",
      app_management: "Sharp Managed",
      hosting_model: "Sharp Hosted",
      first_contact_group: "AMBULATORY COMMUNITY SYSTEMS SUPPORT",
      record_leader: "",
      record_support: "",
      designer: "",
      role_two: "",
      client_status: "Active",
      version: "1912 LTSR",
      aka: ['Citrix', 'CWSAC', 'Workspace'],
      fka: ['Citrix Workspace Formerly'],
      facing: true,
      phi: false,
      pci: true,
      ssn: 'Fully Masked',
      internal_description: "",
      internal_objective: "this is the space for the citrix company description",
      record_image_url:
        "https://picsum.photos/" + wi + "/" + le + "?nocache=" + Math.random(),
      client_original_request: "",
      client_requested_due_date: "",
      client_in_take_clarification_description: "",
      client_follow_up_date: "",
      image_url_type: "record_image_url"
    }
  ],
  fake_posts: [
    {
      author: 1,
      company: 1,
      teams: 1,
      contain:
        "Ad do incididunt reprehenderit enim est laborum. Enim dolore do est eu incididunt. Commodo commodo occaecat tempor magna anim. Minim aute nisi culpa sint est et officia elit. Eiusmod eiusmod cupidatat qui qui mollit et irure nulla eiusmod reprehenderit culpa dolor laboris. Consequat pariatur cillum anim minim.",
      name: "Jose Manuel Valdez Gonzalez",
      occupation: "Web Developer Jr.",
      department: "IT Apps (Department)",
      imageUrl:
        "https://picsum.photos/" + 50 + "/" + 50 + "?nocache=" + Math.random(),
      timestamps: {
        created: "12m"
      },
      images: [
        {
          url:
            "https://www.pngitem.com/pimgs/m/160-1600311_free-png-download-happy-person-png-images-background.png",
          title: "Image 0",
          uid: "11110",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 1",
          uid: "11111",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 2",
          uid: "11112",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 3",
          uid: "11113",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 4",
          uid: "11114",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 5",
          uid: "11115",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 6",
          uid: "11116",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 7",
          uid: "11117",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 8",
          uid: "11118",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 9",
          uid: "11119",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 10",
          uid: "11120",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 11",
          uid: "11122",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 12",
          uid: "11123",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 13",
          uid: "11124",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 14",
          uid: "11125",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 15",
          uid: "11126",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 16",
          uid: "11127",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 17",
          uid: "11128",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 18",
          uid: "11129",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 19",
          uid: "11130",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 1",
          uid: "11131",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 1",
          uid: "11132",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 1",
          uid: "11133",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 1",
          uid: "11134",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 1",
          uid: "11135",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 1",
          uid: "11136",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 1",
          uid: "11137",
          record_type: "image",
          image_url_type: "url"
        },
        {
          url: "https://picsum.photos/1280/720?nocache=" + Math.random(),
          title: "Image 1",
          uid: "11138",
          record_type: "image",
          image_url_type: "url"
        }
      ],
      reactions: {
        likes: 100,
        enchants: 23,
        unlikes: 21
      },
      comments: [
        {
          name: "Eduardo Ramirez",
          occupation: "HR Recruiter",
          imageUrl:
            "https://picsum.photos/" +
            50 +
            "/" +
            50 +
            "?nocache=" +
            Math.random(),
          message:
            "In duis ea irure et magna quis cecat consectetur aute officia in incididunt ut exercitation do. Eiusmod irure tempor reprehenderit do minim nostrud proident reprehenderit. Irure aute do proident duis Lorem tempor. Nisi sit eiusmod duis qui elit voluptate tempor aute.",
          reactions: {
            likes: 3,
            enchants: 21,
            unlikes: 6
          },
          timestamps: {
            created: "14min"
          },
          nested_comments: [
            {
              name: "Eduardo Ramirez",
              imageUrl:
                "https://picsum.photos/" +
                50 +
                "/" +
                50 +
                "?nocache=" +
                Math.random(),
              message:
                "In duis ea irure et magna quis commodo sunt enimit voluptate tempor aute.",
              reactions: {
                likes: 7,
                enchants: 21,
                unlikes: 6
              },
              timestamps: {
                created: "14min"
              }
            }
          ]
        },
        {
          name: "Eduardo Ramirez",
          occupation: "CEO",
          imageUrl:
            "https://picsum.photos/" +
            50 +
            "/" +
            50 +
            "?nocache=" +
            Math.random(),
          message:
            "In duis ea irure et magna quis commodo sunt enim fugiatre eiusmod duis occaecat consectetur aute officia in incididunt ut exercitation do. Eiusmod irure tempor reprehenderit do minim nostrud proident reprehenderit. Irure aute do proident duis Lorem tempor. Nisi sit eiusmod duis qui elit voluptate tempor aute.",
          reactions: {
            likes: 21,
            enchants: 21,
            unlikes: 6
          },
          timestamps: {
            created: "14min"
          },
          nested_comments: [
            {
              name: "Eduardo Ramirez",
              imageUrl:
                "https://picsum.photos/" +
                50 +
                "/" +
                50 +
                "?nocache=" +
                Math.random(),
              message:
                "In duirem tempor. Nisi sit eiusmod duis qui elit voluptate tempor aute.",
              reactions: {
                likes: 9,
                enchants: 21,
                unlikes: 6
              },
              timestamps: {
                created: "14min"
              }
            },
            {
              name: "Eduardo Ramirez",
              imageUrl:
                "https://picsum.photos/" +
                50 +
                "/" +
                50 +
                "?nocache=" +
                Math.random(),
              message:
                "In duirem temtate tempor aute.",
              reactions: {
                likes: 1,
                enchants: 21,
                unlikes: 6
              },
              timestamps: {
                created: "14min"
              }
            }
          ]
        }
      ]
    },
    {
      author: 2,
      company: 2,
      teams: 2,
      contain:
        "We are doing rationalization and need your approval.",
      name: "Sally Ackerman",
      occupation: "IT Analyst",
      department: "IT Apps (Department)",
      imageUrl:
        "https://picsum.photos/" + 50 + "/" + 50 + "?nocache=" + Math.random(),
      timestamps: {
        created: "2h"
      },
      images: [],
      reactions: {
        likes: 12,
        enchants: 23,
        unlikes: 21
      },
      comments: [],
      postTagTitle: 'IT App Request For Approval',
      postType: 'request',
      request: {
        title: 'Awesome IT Application',
        users: [
          { approval: true, imgSrc: "https://cdn.vuetifyjs.com/images/john.jpg", name: 'John' },
          { approval: true, imgSrc: "https://cdn.vuetifyjs.com/images/john.jpg", name: 'Joe' },
          { approval: true, imgSrc: "https://cdn.vuetifyjs.com/images/john.jpg", name: 'Anne' },
          { approval: false, imgSrc: "https://cdn.vuetifyjs.com/images/john.jpg", name: 'Julia' },
          { approval: false, imgSrc: "https://cdn.vuetifyjs.com/images/john.jpg", name: 'Hanna' },
        ]
      },
      componentName: Rationalization.Costs
    },
    {
      author: 3,
      company: 3,
      teams: 3,
      contain:
        "Ad do incididunt reprehenderit enim est laborum. Enim dolore do est eu incididunt. Commodo commodo occaecat tempor magna anim. Minim aute nisi culpa sint est et officia elit. Eiusmod eiusmod cupidatat qui qui mollit et irure nulla eiusmod reprehenderit culpa dolor laboris. Consequat pariatur cillum anim minim.",
      name: "Rodrigo Martinez",
      occupation: "HR Recruiter",
      department: "IT Apps (Department)",
      imageUrl:
        "https://picsum.photos/" + 50 + "/" + 50 + "?nocache=" + Math.random(),
      timestamps: {
        created: "2h"
      },
      images: [],
      reactions: {
        likes: 100,
        enchants: 23,
        unlikes: 21
      },
      comments: [
        {
          name: "Eduardo Ramirez",
          occupation: "HR Recruiter",
          imageUrl:
            "https://picsum.photos/" +
            50 +
            "/" +
            50 +
            "?nocache=" +
            Math.random(),
          message:
            "In duis ea irure et magna quis commrehenderit do minim nostrud proident reprehenderit. Irure aute do proident duis Lorem tempor. Nisi sit eiusmod duis qui elit voluptate tempor aute.",
          reactions: {
            likes: 13,
            enchants: 21,
            unlikes: 6
          },
          timestamps: {
            created: "14min"
          },
          nested_comments: [
            {
              name: "Eduardo Ramirez",
              imageUrl:
                "https://picsum.photos/" +
                50 +
                "/" +
                50 +
                "?nocache=" +
                Math.random(),
              message:
                "In duis ea irure et magna quis commodo sunt enim fugiator aute.",
              reactions: {
                likes: 0,
                enchants: 21,
                unlikes: 6
              },
              timestamps: {
                created: "14min"
              }
            },
            {
              name: "Eduardo Ramirez",
              imageUrl:
                "https://picsum.photos/" +
                50 +
                "/" +
                50 +
                "?nocache=" +
                Math.random(),
              message:
                "In duis ea irure et magna quis co reprehenderit. Irure aute do proident duis Lorem tempor. Nisi sit eiusmod duis qui elit voluptate tempor aute.",
              reactions: {
                likes: 4,
                enchants: 21,
                unlikes: 6
              },
              timestamps: {
                created: "14min"
              }
            }
          ]
        }
      ]
    },
    {
      author: 1,
      company: 2,
      teams: 3,
      contain:
        "Ad do incididunt reprehenderit enim est laborum. Enim dolore do est eu incididunt. Commodo commodo occaecat tempor magna anim. Minim aute nisi culpa sint est et officia elit. Eiusmod eiusmod cupidatat qui qui mollit et irure nulla eiusmod reprehenderit culpa dolor laboris. Consequat pariatur cillum anim minim.",
      name: "Rodrigo Martinez",
      occupation: "Project Manager",
      department: "IT Apps (Department)",
      imageUrl:
        "https://picsum.photos/" + 50 + "/" + 50 + "?nocache=" + Math.random(),
      timestamps: {
        created: "2m"
      },
      images: [],
      reactions: {
        likes: 100,
        enchants: 23,
        unlikes: 21
      },
      comments: []
    },
    {
      author: 2,
      company: 3,
      teams: 1,
      contain:
        "Ad do incididunt reprehenderit enim est laborum. Enim dolore do est eu incididunt. Commodo commodo occaecat tempor magna anim. Minim aute nisi culpa sint est et officia elit. Eiusmod eiusmod cupidatat qui qui mollit et irure nulla eiusmod reprehenderit culpa dolor laboris. Consequat pariatur cillum anim minim.",
      name: "Rodrigo Martinez",
      occupation: "DevOps Engineer",
      department: "IT Apps (Department)",
      imageUrl:
        "https://picsum.photos/" + 50 + "/" + 50 + "?nocache=" + Math.random(),
      timestamps: {
        created: "25m"
      },
      images: [],
      reactions: {
        likes: 21,
        enchants: 21,
        unlikes: 21
      },
      comments: []
    }
  ],
  fake_companies: [
    {
      record_type: "itapps",
      record_name: "Test Company 0",
      companyType: 'company',
      title: "The Lorem Ipsum Co.",
      tagType: false,
      type: 'All',
      email: "contact@sharp.com",
      phone: "(915) 445 - 1234",
      url: "www.sharphealthcare.co",
      tags: ['Veteran Owned','Economically Disadvantaged Women',' Women-Owned Small Business Joint Venture'],
      record_image_url: "https://picsum.photos/" + wi + "/" + le + "?nocache=" + Math.random(),
    },
    {
      record_type: "itapps",
      record_name: "Test Company 1",
      companyType: 'company',
      title: "Awesome Company X",
      tagType: true,
      type: 'Vendor',
      email: "contact@sharp.com",
      phone: "(915) 445 - 1234",
      url: "www.sharphealthcare.co",
      tags: ['Veteran Owned','Economically Disadvantaged Women',' Women-Owned Small Business Joint Venture'],
      record_image_url: "https://picsum.photos/" + wi + "/" + le + "?nocache=" + Math.random(),
    },
    {
      record_type: "itapps",
      record_name: "Test Company 2",
      companyType: 'company',
      title: "Nicest Customer Ever",
      tagType: true,
      type: 'Customer',
      email: "contact@sharp.com",
      phone: "(915) 445 - 1234",
      url: "www.sharphealthcare.co",
      tags: ['Veteran Owned','Economically Disadvantaged Women',' Women-Owned Small Business Joint Venture'],
      record_image_url: "https://picsum.photos/" + wi + "/" + le + "?nocache=" + Math.random(),
    },
    {
      record_type: "itapps",
      record_name: "Test Company 0",
      companyType: 'company',
      title: "The Lorem Ipsum Co.",
      tagType: false,
      type: 'All',
      email: "contact@sharp.com",
      phone: "(915) 445 - 1234",
      url: "www.sharphealthcare.co",
      tags: ['Veteran Owned','Economically Disadvantaged Women',' Women-Owned Small Business Joint Venture'],
      record_image_url: "https://picsum.photos/" + wi + "/" + le + "?nocache=" + Math.random(),
    },
    {
      record_type: "itapps",
      record_name: "Test Company 1",
      companyType: 'company',
      title: "Awesome Company X",
      tagType: true,
      type: 'Vendor',
      email: "contact@sharp.com",
      phone: "(915) 445 - 1234",
      url: "www.sharphealthcare.co",
      tags: ['Veteran Owned','Economically Disadvantaged Women',' Women-Owned Small Business Joint Venture'],
      record_image_url: "https://picsum.photos/" + wi + "/" + le + "?nocache=" + Math.random(),
    },
    {
      record_type: "itapps",
      record_name: "Test Company 2",
      companyType: 'company',
      title: "Nicest Customer Ever",
      tagType: true,
      type: 'Customer',
      email: "contact@sharp.com",
      phone: "(915) 445 - 1234",
      url: "www.sharphealthcare.co",
      tags: ['Veteran Owned','Economically Disadvantaged Women',' Women-Owned Small Business Joint Venture'],
      record_image_url: "https://picsum.photos/" + wi + "/" + le + "?nocache=" + Math.random(),
    },
        {
      record_type: "itapps",
      record_name: "Test Company 0",
      companyType: 'company',
      title: "The Lorem Ipsum Co.",
      tagType: false,
      type: 'All',
      email: "contact@sharp.com",
      phone: "(915) 445 - 1234",
      url: "www.sharphealthcare.co",
      tags: ['Veteran Owned','Economically Disadvantaged Women',' Women-Owned Small Business Joint Venture'],
      record_image_url: "https://picsum.photos/" + wi + "/" + le + "?nocache=" + Math.random(),
    },
    {
      record_type: "itapps",
      record_name: "Test Company 1",
      companyType: 'company',
      title: "Awesome Company X",
      tagType: true,
      type: 'Vendor',
      email: "contact@sharp.com",
      phone: "(915) 445 - 1234",
      url: "www.sharphealthcare.co",
      tags: ['Veteran Owned','Economically Disadvantaged Women',' Women-Owned Small Business Joint Venture'],
      record_image_url: "https://picsum.photos/" + wi + "/" + le + "?nocache=" + Math.random(),
    },
    {
      record_type: "itapps",
      record_name: "Test Company 2",
      companyType: 'company',
      title: "Nicest Customer Ever",
      tagType: true,
      type: 'Customer',
      email: "contact@sharp.com",
      phone: "(915) 445 - 1234",
      url: "www.sharphealthcare.co",
      tags: ['Veteran Owned','Economically Disadvantaged Women',' Women-Owned Small Business Joint Venture'],
      record_image_url: "https://picsum.photos/" + wi + "/" + le + "?nocache=" + Math.random(),
    },
  ],
};
