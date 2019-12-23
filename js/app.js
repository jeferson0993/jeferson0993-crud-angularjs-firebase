
const app = angular.module("studentApp", ['ngRoute', 'firebase', 'toastr']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'home.html',
            controller: 'fetchStudent'
        })
        .when('/add', {
            templateUrl: 'add.html',
            controller: 'addStudent'
        })
        .when('/edit/:id', {
            templateUrl: 'edit.html',
            controller: 'editStudent'
        })
});

app.controller("fetchStudent", function ($scope, $firebaseArray, toastr) {
    let ref = firebase.database().ref("students");
    $scope.records = $firebaseArray(ref);

    $scope.removeData = function (info) {
        $scope.records.$remove(info)
            .then(function () {
                toastr.error("", "Estudante " + info.name + " excluido(a)!");
                console.info(info);
            }, function (err) {
                console.error(err);
            }
        );
    }
});

app.controller("addStudent", function ($scope, $firebaseArray, toastr) {
    let ref = firebase.database().ref("students");
    $scope.add = function () {
        console.log($scope.student);
        $firebaseArray(ref).$add($scope.student).then(function (ref) {
            toastr.success("", "Estudante " + $scope.student.name + " cadastrado(a)!");
            $scope.student.name = '';
            $scope.student.course = '';
            $scope.student.semestre = '';
        });
    }
});

app.controller("editStudent", function ($scope, $firebaseArray, toastr, $firebaseObject, $routeParams) {
    let id = $routeParams.id;
    let ref = firebase.database().ref("students/" + id);
    $scope.student = $firebaseObject(ref);

    $scope.edit = function (id) {
        let ref = firebase.database().ref("students/" + id);
        ref.update({
                name: $scope.student.name,
                course: $scope.student.course,
                semestre: $scope.student.semestre
            }).then(function(ref){
                console.log($scope.student);
                toastr.info("", "Estudante " + $scope.student.name + " alterado(a)!");
            },function(err){
                toastr.error("","Erro :(");
                console.error(err);
            });
    }

})