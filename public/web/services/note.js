/**
 * Created by bernatmir on 20/11/16.
 */
angular.module('web').factory('Note', function NoteFactory() {
    return{
        all:function(){
            return $http({method: 'GET', url:'/notes'});
        },
        create:function(note){
            return $http({method: 'POST', url:'/notes', data: note});
        }
    }

});