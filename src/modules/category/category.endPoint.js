import { roles } from "../../middlewares/auth.js";

const categoryEndPoint = {
    create:[roles.Admin],
    update:[roles.Admin]
}

export default categoryEndPoint