const BASE_URI="http://localhost:8080/torncityservices/";

export const getLoginURI=function(APIKey){
    return BASE_URI+'player/auth/'+APIKey
}

export const getJobDetailTemplatesURI=function(){
    return BASE_URI+'/job/detailTemplates';
}

export const getJobDetailTemplateByNameURI=function(jobDetailTemplateName){
    return BASE_URI+'/job/detailTemplate/'+jobDetailTemplateName;
}

export const getPostNewJobURI=function(){
    return BASE_URI+'/job/post';
}