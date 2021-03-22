import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';


let users = [{ id: 1, firstName: 'Alejandro', rol: 'Admin', username: 'admin', password: 'admin' }];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
          console.log(url);
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/users/register') && method === 'POST':
                    return register();
                default:
                    return next.handle(request);
            }
        }

        function authenticate() {
            const { username, password } = body;
            const user = users.find(x => x.username === username && x.password === password);
            if (!user) return error('Usuario o password incorrectos');
            return ok({
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                rol: user.rol,
                token: 'fake-jwt-token'
            })
        }

        function register() {
          const { nombre, username, password, rol } = body;
          console.log(body);
          users.push(
            {
              id: 0,
              firstName: nombre,
              username: username,
              password: password,
              rol: rol
            }
            );
            console.log(users);
            const user = users.find(x => x.username === username && x.password === password);
          return ok({
              id: user.id,
              username: user.username,
              rol: user.rol,
              firstName: user.firstName,
              token: 'fake-jwt-token'
          })
      }

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
