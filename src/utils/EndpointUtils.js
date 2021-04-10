const BASE_URI="http://localhost:8080/torncityservices/";

export const getLoginURI=function(APIKey){
    return BASE_URI+'player/auth/'+APIKey
}

export const getJobDetailTemplatesURI=function(){
    return BASE_URI+'public/jobDetailTemplates';
}

export const getJobDetailFormTemplateByNameURI=function(jobDetailTemplateName){
    return BASE_URI+'public/jobDetailFormTemplate/'+jobDetailTemplateName;
}

export const getJobDetailFilterTemplateByNameURI=function(jobDetailTemplateName){
    return BASE_URI+'public/jobDetailFilterTemplate/'+jobDetailTemplateName;
}

export const getPostNewJobURI=function(){
    return BASE_URI+'job/post';
}

export const getSimpleSearchURI=function(){
    return BASE_URI+'job/search';
}

export const getAdvancedSearchURI=function(){
    return BASE_URI+'job/advancedSearch';
}