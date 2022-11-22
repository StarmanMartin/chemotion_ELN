import React, { useState } from "react";
import { Button } from "react-bootstrap";

// const menuItems = [
//   {
//     title: 'Home',
//     url: '/',
//   },
//   {
//     title: 'Services',
//     url: '/services',
//     submenu: [
//       {
//         title: 'web design',
//         url: 'web-design',
//       },
//       {
//         title: 'web development',
//         url: 'web-dev',
//         submenu: [
//           {
//             title: 'Frontend',
//             url: 'frontend',
//           },
//           {
//             title: 'Backend',
//             submenu: [
//               {
//                 title: 'NodeJS',
//                 url: 'node',
//               },
//               {
//                 title: 'PHP',
//                 url: 'php',
//               },
//             ],
//           },
//         ],
//       },
//       {
//         title: 'SEO',
//         url: 'seo',
//       },
//     ],
//   },
//   {
//     title: 'About',
//     url: '/about',
//   },
// ];

const DropdownSubItem = ({ submenus, show }) => {
  return (
    <ul className={`muti-lvl-dp-sub-items-dp ${show ? "" : "hide-drop-down"}`}>
      {
        submenus.map((submenu, index) => (
          <MultiLevelMenuItems items={submenu} key={index} />
        ))
      }
    </ul>
  )
};

const MultiLevelMenuItems = ({ items }) => {
  const [ dropdown, setDropdown ] = useState(false);
  return (
    <li className="muti-lvl-dp-menu-items">
      {
        items.submenu ? (
          <>
            <button type="button" aria-haspopup="muti-lvl-dp-menu-items" aria-expanded="true" onClick={() => setDropdown(!dropdown)}>
              {items.title}{' '}
              <span>&raquo;</span>
            </button>
            <DropdownSubItem submenus={items.submenu} show={dropdown} />
          </>
        ) : (
          <a>{items.title}</a>
        )
      }
    </li>
  );
};

const MutiLevelDropdown = ({
  title, menuItems
}) => {
  const [ dropdown, setDropdown ] = useState(false);
  return (
    <span>
      <Button onClick={() => setDropdown(!dropdown)}>
      {
        title ? title : ""
      }
      </Button>
      {
        menuItems ? (
          <ul className={`muti-lvl-dp-menu list-unstyled ${dropdown ? "" : "hide-drop-down"}`}>
          {
            menuItems.map((menu, index) => {
              return (
                <MultiLevelMenuItems items={menu} key={index} />
              );
            })
          }
          </ul>
        ) : null
      }
    </span>
  )
};

export default MutiLevelDropdown;