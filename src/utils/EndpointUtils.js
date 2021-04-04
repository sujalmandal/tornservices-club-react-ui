const BASE_URI="http://localhost:8080/torncityservices/";

export const getLoginURI=function(APIKey){
    return BASE_URI+'player/auth/'+APIKey
}

export const getJobDetailTemplatesURI=function(){
    return BASE_URI+'/job/jobDetailTemplates';
}

export const getJobDetailFormTemplateByNameURI=function(jobDetailTemplateName){
    return BASE_URI+'/job/jobDetailFormTemplate/'+jobDetailTemplateName;
}

export const getJobDetailFilterTemplateByNameURI=function(jobDetailTemplateName){
    return BASE_URI+'/job/jobDetailFilterTemplate/'+jobDetailTemplateName;
}

export const getPostNewJobURI=function(){
    return BASE_URI+'/job/post';
}

export const getSimpleSearchURI=function(){
    return BASE_URI+'/job/search';
}