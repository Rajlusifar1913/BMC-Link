import { Router } from "express";

import validate from "../../middlewares/validate.middleware.js";

import {
    createLink,
    getCreatorLinks,
    getLink,
    updateLink,
    deleteLink,
    toggleLink,
    duplicateLink,
    reorderLinks,
    getPublicLinks,
} from "./links.controller.js";

import {
    createLinkSchema,
    updateLinkSchema,
    linkIdParamSchema,
    reorderLinksSchema,
    getLinksQuerySchema,
} from "./links.validation.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const linkRouter = Router();

linkRouter.get(
    "/public/:username",
    getPublicLinks
);

linkRouter.patch(
    "/reorder",
    verifyJWT,
    validate(reorderLinksSchema),
    reorderLinks
);

linkRouter.post(
    "/",
    verifyJWT,
    validate(createLinkSchema),
    createLink
);

linkRouter.get(
    "/",
    verifyJWT,
    validate(getLinksQuerySchema),
    getCreatorLinks
);

linkRouter.get(
    "/:id",
    verifyJWT,
    validate(linkIdParamSchema),
    getLink
);

linkRouter.patch(
    "/:id",
    verifyJWT,
    validate(updateLinkSchema),
    updateLink
);

linkRouter.delete(
    "/:id",
    verifyJWT,
    validate(linkIdParamSchema),
    deleteLink
);

linkRouter.patch(
    "/toggle/:id",
    verifyJWT,
    validate(linkIdParamSchema),
    toggleLink
);

linkRouter.post(
    "/duplicate/:id",
    verifyJWT,
    validate(linkIdParamSchema),
    duplicateLink
);

export default linkRouter;
