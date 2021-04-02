const BASE_URI="http://localhost:8080/torncityservices/";

export const getLoginURI=function(APIKey){
    return BASE_URI+'player/auth/'+APIKey
}

export const getJobDetailTemplatesKeyURI=function(){
    return BASE_URI+'/job/detailTemplates';
}

export const getJobDetailTemplateByKeyURI=function(key){
    return BASE_URI+'/job/detailTemplate/'+key;
}