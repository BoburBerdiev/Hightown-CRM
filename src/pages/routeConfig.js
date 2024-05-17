import {IoIosStats} from "react-icons/io";
import {authRole} from "../shared/constants/AppEnums";
import {FaBuilding, FaUserPlus} from "react-icons/fa";
import {TbBuildingCastle} from "react-icons/tb";
import {BsFillHouseDoorFill} from "react-icons/bs";
import {MdOutlineApartment} from "react-icons/md";
import {LiaMoneyCheckAltSolid} from "react-icons/lia";
import {FiDollarSign} from "react-icons/fi";
import {LuLayoutDashboard} from "react-icons/lu";


const routesConfig = [
    {
        id: 'app',
        title: 'Sample',
        messageId: 'sidebar.sample',
        type: 'group',
        children: [
            // {
            //     id: 'pdf',
            //     title: 'pdf',
            //     messageId: 'sidebar.sample.pdf',
            //     type: 'item',
            //     icon: <IoIosStats/>,
            //     path: '/pdf',
            //     role:authRole.user
            // },
            {
                id: 'dashboard',
                title: 'dashboard',
                messageId: 'sidebar.sample.dashboard',
                type: 'item',
                icon: <LuLayoutDashboard/>,
                path: '/dashboard',
                role:authRole.user
            },
            {
                id: 'selling',
                title: 'selling',
                messageId: 'sidebar.sample.selling',
                type: 'item',
                icon: <IoIosStats/>,
                path: '/selling',
                role:authRole.user
            },
            {
                id: 'slot',
                title: 'slot',
                messageId: 'sidebar.sample.slot',
                type: 'item',
                icon: <MdOutlineApartment/>,
                path: '/slot',
                role:authRole.admin
            },
            {
                id: 'house',
                title: 'house',
                messageId: 'sidebar.sample.house',
                type: 'item',
                icon: <FaBuilding />,
                path: '/house',
                role:authRole.admin

            },
            {
                id: 'floor',
                title: 'floor',
                messageId: 'sidebar.sample.floor',
                type: 'item',
                icon: <TbBuildingCastle/>,
                path: '/floor',
                role:authRole.admin
            },
            {
                id: 'apartment',
                title: 'apartment',
                messageId: 'sidebar.sample.apartment',
                type: 'item',
                icon: <BsFillHouseDoorFill/>,
                path: '/apartment',
                role:authRole.admin

            },
            {
                id: 'payment',
                title: 'payment',
                messageId: 'sidebar.sample.payment',
                type: 'item',
                icon: <LiaMoneyCheckAltSolid/>,
                path: '/payment',
                role:authRole.user
            },
            {
                id: 'user',
                title: 'user',
                messageId: 'sidebar.sample.user',
                type: 'item',
                icon: <FaUserPlus/>,
                path: '/user',
                role:authRole.admin

            },
            {
                id: 'course',
                title: 'course',
                messageId: 'sidebar.sample.course',
                type: 'item',
                icon: <FiDollarSign/>,
                path: '/course',
                role:authRole.admin

            },

        ],
    },
];
export default routesConfig;
