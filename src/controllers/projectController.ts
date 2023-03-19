import { Request, Response, NextFunction } from "express";
import { IRequest, IRole, IUser } from "../commons/types";
import { Project, Role, User } from "../data/models";
import { createUser } from "../data/methods/users";
import { HydratedDocument, Types } from "mongoose";
import { IProject } from "../commons/types";
import { createProjectAndSaveUser } from "../data/methods/projects";


export const projectController = (methods : any) => {
const getAllProjectsFromUser = async (req : IRequest, res : Response, next: NextFunction) => {

    const populatedUser = await User.findById(req.context.user!._id).populate('projects', 'name'); 
if(!populatedUser?.populated('projects')) return res.status(404).send("not populated"); 
    res.status(299).json(populatedUser.projects);
    res.end();

}
const getOneProject = async (req : IRequest, res : Response, next: NextFunction) => {
if(!req.context?.projectId) return res.status(404).send("No project Id")

// ======================== MOVE TO AUTHORIZE NEXT ITERATION =============
// === verify that the user has this project in his list. Otherwise denegate === // 
const project : HydratedDocument<IProject> | null = await Project.findById(req.context.projectId); 
if(!project) return res.status(404).send("No project");     
project.users = project.users.filter((user: IUser)=>user._id?.toString() === req.context.user!._id?.toString());
if(project.users.length<1) return res.status(404).send("User is not in the project"); 
// === // Shouldn't this be done by the authorize function? 

res.status(200).json(project);

}
const addUserToOneProject = async (req : IRequest, res : Response, next: NextFunction) => {

    // ======================== MOVE TO AUTHORIZE NEXT ITERATION =============
    const project : HydratedDocument<IProject> | null = await Project.findById(req.context.projectId); 
    if(!project) return res.status(404).send("No project");     
    // === verify that the user has this project in his list. Otherwise denegate === // 
    project.users = project.users.filter((user: IUser)=>user._id?.toString() === req.context.user!._id?.toString());
    if(project.users.length<1) return res.status(404).send("User is not in the project"); 
    // === // Shouldn't this be done by the authorize function? 

    if(!req.context.secondaryUserId) return res.status(404).send("No user to add to project"); 

const IDOfUserToAdd : Types.ObjectId = req.context.secondaryUserId; 
const userToAddToProject = await User.findById(IDOfUserToAdd)
if(userToAddToProject === null) return res.status(404).send("Can't add an user that is not in database"); 
// the authorize function takes care that the project has populate its users
if(project.users.find(user => user._id?.toString() === IDOfUserToAdd.toString())) return res.status(401).send("this is user is already in the project");
// Find the role in the project 

if(!req.body.roleName) return res.status(401).send("Role name cannot be empty"); 
if(!project.populated('roles')) await project.populate('roles'); 
const projectRole = project.roles.find((role: IRole) => role.name === req.body.roleName)
if(!projectRole) return res.status(401).send("Role don't exist in project"); 
//
project.users.push(userToAddToProject._id); 
userToAddToProject.projects.push(project._id);
userToAddToProject.role.push(projectRole._id as Types.ObjectId);
await project.save(); 
await userToAddToProject.save();
    
        res.status(200).json({project, userToAddToProject});
    }

const editProjectDetails = async (req: IRequest, res: Response, next: NextFunction) => {
    const { isPrivate, name, updateName } = req.body;
    // Validate that the request has the expected properties. 

    // ^-^-^-^-^-^
    req.context.currentProject!.isPrivate = isPrivate; 
    if(!updateName) {
        await req.context.currentProject!.save();
        return res.status(201).json(req.context.currentProject); 
    } else {
        req.context.currentProject!.name = name; 
        return res.status(201).json(req.context.currentProject);
    }




}

const removeUserFromProject = async (req: IRequest, res: Response, next: NextFunction) => {
       // ======================== MOVE TO AUTHORIZE NEXT ITERATION =============
       const project : HydratedDocument<IProject> | null = await Project.findById(req.context.projectId); 
       if(!project) return res.status(404).send("No project");     
       // === verify that the user has this project in his list. Otherwise denegate === // 
       const isUserInProject = project.users.findIndex((user: IUser)=>user._id?.toString() === req.context.user!._id?.toString());
       if(isUserInProject === -1) return res.status(404).send("User is not in the project"); 
       // === // Shouldn't this be done by the authorize function? 

    if(!project.populated('users')) await project.populate('users'); 
      const indexOfUserToRemove = project.users.findIndex((user: IUser) => user._id?.toString() === req.context.secondaryUserId?.toString())    
      if(indexOfUserToRemove === -1) return res.status(404).send("User can't be removed, is not in the project");
      project.users = project.users.filter((user: IUser)=>user._id?.toString() !== req.context.secondaryUserId!.toString());
    
await project.save(); // this will remove the user even if the user has been deleted from Database
const secondaryUser = await User.findById(req.context.secondaryUserId); 
if(!secondaryUser) return res.status(404).send("User is not found"); 
const isProjectInUserList : number = secondaryUser.projects.findIndex((project: IProject) => project._id?.toString() === project._id?.toString())
if(isProjectInUserList === -1) return res.status(404).send("This project is not in user list"); 
secondaryUser.projects =  secondaryUser.projects.filter(projectFromUser => projectFromUser._id?.toString() !== project._id.toString());
await secondaryUser.save()
return res.status(201).json({project, secondaryUser}); 

}

const createNewProject = async (req: IRequest, res: Response, next: NextFunction) => {
    // This needs validation
    const {name, isPrivate} = req.body;

    const project = await createProjectAndSaveUser(req.context.user! as HydratedDocument<IUser>, name, 'admin', isPrivate ); 
    res.status(201).json({project})
}

const deleteProject = async (req: IRequest, res: Response, next: NextFunction) => {
    // ======================== MOVE TO AUTHORIZE NEXT ITERATION =============
// === verify that the user has this project in his list. Otherwise denegate === // 
const project : HydratedDocument<IProject> | null = await Project.findById(req.context.projectId); 
if(!project) return res.status(404).send("No project");     
if(!project.populated('users')) await project.populate({path: 'users', populate: 'role'});  
project.users = project.users.filter((user: IUser)=>{
    if(user._id?.toString() === req.context.user!._id?.toString()){
        if(user.role?.some((role : IRole)=> 
        { 
            if(role.project?.toString() === req.context.projectId?.toString() && role.name.toLowerCase() === 'admin'){
                return role 

            }

        }
        
        ))
        
        {
            console.log("passed the second")
            return user
        }
    } 
});
if(project.users.length<1) return res.status(404).send("User is not in the project, or does not have the access"); 

// for each user in the project remove the project from their list
project.users.map(async (user: HydratedDocument<IUser>) => {
    user.projects = user.projects.filter((UserProject: IProject)=> UserProject._id?.toString() !== project._id.toString())
user.role = user.role.filter((UserRole: IRole)=> UserRole.project?.toString() !== project._id.toString())
    await user.save()
})
// for each role in the project remove the role from the database
project.roles.map(async role => await Role.deleteOne({_id: role._id}))
await Project.deleteOne({_id: project._id});

return res.status(201).json(project); 

}


return { deleteProject, createNewProject, removeUserFromProject, getAllProjectsFromUser, addUserToOneProject,getOneProject, editProjectDetails };
};