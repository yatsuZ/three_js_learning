/**
 * Type declarations for cannon-es
 * https://github.com/pmndrs/cannon-es
 */
declare module 'cannon-es' {
	export class Vec3 {
		x: number;
		y: number;
		z: number;
		constructor(x?: number, y?: number, z?: number);
		set(x: number, y: number, z: number): Vec3;
		copy(v: Vec3): Vec3;
		vsub(v: Vec3, target?: Vec3): Vec3;
		vadd(v: Vec3, target?: Vec3): Vec3;
		scale(scalar: number, target?: Vec3): Vec3;
		length(): number;
		normalize(): Vec3;
		dot(v: Vec3): number;
		cross(v: Vec3, target?: Vec3): Vec3;
	}

	export class Quaternion {
		x: number;
		y: number;
		z: number;
		w: number;
		constructor(x?: number, y?: number, z?: number, w?: number);
		setFromEuler(x: number, y: number, z: number, order?: string): Quaternion;
		copy(q: Quaternion): Quaternion;
	}

	export class Material {
		name: string;
		friction: number;
		restitution: number;
		constructor(options?: string | { name?: string; friction?: number; restitution?: number });
	}

	export class ContactMaterial {
		constructor(m1: Material, m2: Material, options?: {
			friction?: number;
			restitution?: number;
			contactEquationStiffness?: number;
			contactEquationRelaxation?: number;
		});
	}

	export class Shape {
		type: number;
	}

	export class Box extends Shape {
		halfExtents: Vec3;
		constructor(halfExtents: Vec3);
	}

	export class Sphere extends Shape {
		radius: number;
		constructor(radius: number);
	}

	export class Plane extends Shape {
		constructor();
	}

	export class Cylinder extends Shape {
		radiusTop: number;
		radiusBottom: number;
		height: number;
		numSegments: number;
		constructor(radiusTop: number, radiusBottom: number, height: number, numSegments: number);
	}

	export class Body {
		position: Vec3;
		quaternion: Quaternion;
		velocity: Vec3;
		angularVelocity: Vec3;
		mass: number;
		material: Material | null;
		type: number;
		linearDamping: number;
		angularDamping: number;

		static DYNAMIC: number;
		static STATIC: number;
		static KINEMATIC: number;

		constructor(options?: {
			mass?: number;
			position?: Vec3;
			quaternion?: Quaternion;
			material?: Material;
			type?: number;
			linearDamping?: number;
			angularDamping?: number;
		});

		addShape(shape: Shape, offset?: Vec3, orientation?: Quaternion): Body;
		applyForce(force: Vec3, relativePoint?: Vec3): void;
		applyImpulse(impulse: Vec3, relativePoint?: Vec3): void;
		addEventListener(type: string, callback: (event: unknown) => void): void;
		removeEventListener(type: string, callback: (event: unknown) => void): void;
	}

	export class NaiveBroadphase {
		constructor();
	}

	export class SAPBroadphase {
		constructor(world: World);
	}

	export class World {
		gravity: Vec3;
		broadphase: NaiveBroadphase | SAPBroadphase;
		bodies: Body[];

		constructor(options?: {
			gravity?: Vec3;
		});

		addBody(body: Body): void;
		removeBody(body: Body): void;
		addContactMaterial(cm: ContactMaterial): void;
		step(dt: number, timeSinceLastCalled?: number, maxSubSteps?: number): void;
	}
}
